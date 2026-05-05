import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * Wraps all successful API responses in the standard envelope:
 *   { success: true, data: <original response>, meta?: <pagination> }
 *
 * If the controller already returns an object with a `success` key (e.g., it
 * explicitly builds the envelope), it is passed through unchanged.
 */
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Already wrapped — pass through
        if (data && typeof data === 'object' && 'success' in data) return data

        // Wrap bare responses
        return { success: true, data }
      }),
    )
  }
}
