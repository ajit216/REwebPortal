import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'

/**
 * Global exception filter.
 * Normalises all errors into the REwebPortal API response envelope:
 *   { success: false, error: { code, message, statusCode } }
 *
 * Handles:
 *  - NestJS HttpExceptions (validation errors, 404, 403, etc.)
 *  - Prisma errors (unique constraint, not found, etc.)
 *  - Unexpected errors (500)
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let code = 'INTERNAL_ERROR'
    let message = 'An unexpected error occurred'

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const body = exceptionResponse as Record<string, any>
        message = Array.isArray(body.message) ? body.message.join('; ') : body.message ?? message
        code = body.error ?? this.httpStatusToCode(statusCode)
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
        code = this.httpStatusToCode(statusCode)
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const { statusCode: s, code: c, message: m } = this.handlePrismaError(exception)
      statusCode = s
      code = c
      message = m
    } else if (exception instanceof Error) {
      // Known app-level errors thrown as plain Error
      message = exception.message
      code = exception.message.toUpperCase().replace(/\s+/g, '_')
      this.logger.error(exception.message, exception.stack, `${request.method} ${request.url}`)
    }

    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${statusCode} ${code}: ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      )
    } else {
      this.logger.warn(`${request.method} ${request.url} → ${statusCode} ${code}: ${message}`)
    }

    response.status(statusCode).json({
      success: false,
      error: { code, message, statusCode },
    })
  }

  private handlePrismaError(err: Prisma.PrismaClientKnownRequestError): {
    statusCode: number
    code: string
    message: string
  } {
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        return {
          statusCode: HttpStatus.CONFLICT,
          code: 'DUPLICATE_ENTRY',
          message: `A record with this ${(err.meta?.target as string[])?.join(', ')} already exists`,
        }
      case 'P2025': // Record not found
        return {
          statusCode: HttpStatus.NOT_FOUND,
          code: 'NOT_FOUND',
          message: 'The requested record was not found',
        }
      case 'P2003': // Foreign key constraint
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          code: 'INVALID_REFERENCE',
          message: 'Referenced record does not exist',
        }
      default:
        this.logger.error(`Unhandled Prisma error code: ${err.code}`, err.message)
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          code: 'DATABASE_ERROR',
          message: 'A database error occurred',
        }
    }
  }

  private httpStatusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMITED',
      500: 'INTERNAL_ERROR',
    }
    return map[status] ?? 'HTTP_ERROR'
  }
}
