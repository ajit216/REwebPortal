import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

export interface SmsPayload {
  to: string         // +91XXXXXXXXXX
  templateKey: SmsTemplate
  variables: Record<string, string>
}

export interface EmailPayload {
  to: string
  subject: string
  html: string
  from?: string      // defaults to env EMAIL_FROM
}

/**
 * SMS template keys — each maps to a MSG91 DLT-registered template ID.
 * Template IDs are configured in environment variables.
 *
 * DLT (Distributed Ledger Technology) registration is required by TRAI
 * for all transactional SMS in India. All templates must be pre-approved.
 */
export enum SmsTemplate {
  OTP                    = 'OTP',
  VERIFICATION_APPROVED  = 'VERIFICATION_APPROVED',
  VERIFICATION_REJECTED  = 'VERIFICATION_REJECTED',
  GRIEVANCE_ACKNOWLEDGED = 'GRIEVANCE_ACKNOWLEDGED',
  GRIEVANCE_RESOLVED     = 'GRIEVANCE_RESOLVED',
  GRIEVANCE_ESCALATED    = 'GRIEVANCE_ESCALATED',
  RED_FLAG_ALERT         = 'RED_FLAG_ALERT',
  RERA_UPDATE            = 'RERA_UPDATE',
  WHATSAPP_JOIN_REQUEST  = 'WHATSAPP_JOIN_REQUEST',
}

/** Template bodies (for reference — actual content registered on MSG91/DLT) */
const SMS_TEMPLATES: Record<SmsTemplate, string> = {
  [SmsTemplate.OTP]:
    '{#var#} is your REwebPortal OTP. Valid for 5 minutes. Do not share this with anyone.',
  [SmsTemplate.VERIFICATION_APPROVED]:
    'Your ownership at {#var#} has been verified! You now have Verified Buyer status on REwebPortal.',
  [SmsTemplate.VERIFICATION_REJECTED]:
    'Your ownership verification for {#var#} could not be approved. Please re-upload a clearer document.',
  [SmsTemplate.GRIEVANCE_ACKNOWLEDGED]:
    'Your grievance #{#var#} has been acknowledged by REwebPortal. We are reviewing your complaint.',
  [SmsTemplate.GRIEVANCE_RESOLVED]:
    'Good news! Your grievance #{#var#} has been marked resolved. Log in to confirm resolution.',
  [SmsTemplate.GRIEVANCE_ESCALATED]:
    'Your grievance #{#var#} has been escalated to {#var#}. Resources to proceed have been added to your account.',
  [SmsTemplate.RED_FLAG_ALERT]:
    'Alert: A new concern has been flagged for {#var#}. Log in to REwebPortal for details.',
  [SmsTemplate.RERA_UPDATE]:
    'RERA data for {#var#} has been updated on REwebPortal. Log in to review the latest compliance status.',
  [SmsTemplate.WHATSAPP_JOIN_REQUEST]:
    'Your request to join the {#var#} buyer community has been forwarded. You will be added within 24 hours.',
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)
  private readonly msg91AuthKey = process.env.MSG91_AUTH_KEY ?? ''
  private readonly msg91SenderId = process.env.MSG91_SENDER_ID ?? 'REWEBT'
  private readonly resendApiKey = process.env.RESEND_API_KEY ?? ''
  private readonly emailFrom = process.env.EMAIL_FROM ?? 'noreply@rewebportal.in'

  constructor(private readonly http: HttpService) {}

  /**
   * Send OTP SMS via MSG91.
   * Separate method because MSG91 has a dedicated OTP API with built-in resend logic.
   */
  async sendOTP(phone: string, otp: string): Promise<void> {
    this.logger.log(`Sending OTP to ${this.maskPhone(phone)}`)

    if (!this.msg91AuthKey) {
      this.logger.warn('MSG91_AUTH_KEY not set — skipping SMS in development')
      this.logger.debug(`[DEV] OTP for ${phone}: ${otp}`)
      return
    }

    try {
      await firstValueFrom(
        this.http.post('https://api.msg91.com/api/v5/otp', {
          template_id: process.env.MSG91_OTP_TEMPLATE_ID,
          mobile: phone.replace('+', ''),
          authkey: this.msg91AuthKey,
          otp,
        }),
      )
    } catch (err) {
      this.logger.error(`Failed to send OTP to ${this.maskPhone(phone)}`, err)
      // Do not rethrow — OTP send failure should not crash the auth flow;
      // the caller should handle the case where OTP may not arrive.
      throw new Error('OTP_SEND_FAILED')
    }
  }

  /**
   * Send a templated transactional SMS via MSG91.
   * Used for all notifications other than OTP.
   */
  async sendSMS(payload: SmsPayload): Promise<void> {
    this.logger.log(`Sending SMS template ${payload.templateKey} to ${this.maskPhone(payload.to)}`)

    if (!this.msg91AuthKey) {
      this.logger.warn('MSG91_AUTH_KEY not set — skipping SMS in development')
      this.logger.debug(`[DEV] SMS ${payload.templateKey} → ${payload.to}: ${JSON.stringify(payload.variables)}`)
      return
    }

    try {
      const templateId = process.env[`MSG91_TEMPLATE_ID_${payload.templateKey}`]
      if (!templateId) {
        this.logger.warn(`No template ID configured for ${payload.templateKey} — skipping`)
        return
      }

      const smsBody = this.renderTemplate(payload.templateKey, payload.variables)

      await firstValueFrom(
        this.http.post('https://api.msg91.com/api/v5/flow/', {
          template_id: templateId,
          sender: this.msg91SenderId,
          short_url: '0',
          mobiles: payload.to.replace('+', ''),
          authkey: this.msg91AuthKey,
          ...payload.variables,
        }),
      )
    } catch (err) {
      this.logger.error(`Failed to send SMS ${payload.templateKey}`, err)
      // Log failure but do not rethrow — notification failures should not crash core flows
    }
  }

  /**
   * Send transactional email via Resend.
   */
  async sendEmail(payload: EmailPayload): Promise<void> {
    this.logger.log(`Sending email to ${payload.to}: ${payload.subject}`)

    if (!this.resendApiKey) {
      this.logger.warn('RESEND_API_KEY not set — skipping email in development')
      this.logger.debug(`[DEV] Email to ${payload.to}: ${payload.subject}`)
      return
    }

    try {
      await firstValueFrom(
        this.http.post(
          'https://api.resend.com/emails',
          {
            from: payload.from ?? this.emailFrom,
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
          },
          {
            headers: {
              Authorization: `Bearer ${this.resendApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      )
    } catch (err) {
      this.logger.error(`Failed to send email to ${payload.to}`, err)
    }
  }

  // ─── Convenience methods for common notification scenarios ─────────────────

  async notifyVerificationApproved(phone: string, projectName: string): Promise<void> {
    await this.sendSMS({
      to: phone,
      templateKey: SmsTemplate.VERIFICATION_APPROVED,
      variables: { project: projectName },
    })
  }

  async notifyGrievanceAcknowledged(phone: string, grievanceRef: string): Promise<void> {
    await this.sendSMS({
      to: phone,
      templateKey: SmsTemplate.GRIEVANCE_ACKNOWLEDGED,
      variables: { ref: grievanceRef },
    })
  }

  async notifyRedFlag(phone: string, projectName: string): Promise<void> {
    await this.sendSMS({
      to: phone,
      templateKey: SmsTemplate.RED_FLAG_ALERT,
      variables: { project: projectName },
    })
  }

  async notifyRERAUpdate(phone: string, projectName: string): Promise<void> {
    await this.sendSMS({
      to: phone,
      templateKey: SmsTemplate.RERA_UPDATE,
      variables: { project: projectName },
    })
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private maskPhone(phone: string): string {
    return phone.length >= 10 ? `${phone.slice(0, 3)}XXXXXXX${phone.slice(-2)}` : '***'
  }

  private renderTemplate(key: SmsTemplate, vars: Record<string, string>): string {
    let template = SMS_TEMPLATES[key]
    for (const [k, v] of Object.entries(vars)) {
      template = template.replace('{#var#}', v)
    }
    return template
  }
}
