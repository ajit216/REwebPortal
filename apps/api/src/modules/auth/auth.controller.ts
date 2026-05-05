import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { SendOtpDto, VerifyOtpDto, RefreshTokenDto, AdminLoginDto } from './dto/auth.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Public } from '../../common/decorators/public.decorator'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('otp/send')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 600_000, limit: 3 } }) // 3 per phone per 10 min
  @ApiOperation({ summary: 'Send OTP to a verified India mobile number' })
  sendOTP(@Body() dto: SendOtpDto) {
    return this.authService.sendOTP(dto.phone)
  }

  @Post('otp/verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and receive JWT tokens (creates account if first login)' })
  verifyOTP(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOTP(dto.phone, dto.otp)
  }

  @Post('token/refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using a valid refresh token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Invalidate current session tokens' })
  logout(@Request() req: any) {
    const { userId, jti } = req.user
    return this.authService.logout(userId, jti)
  }

  @Post('admin/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin/Moderator login with email + password (not OTP)' })
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto.email, dto.password)
  }
}
