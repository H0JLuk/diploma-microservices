import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      timeout(4_000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException('Время запроса истекло'));
        }
        return throwError(() => err);
      }),
    );
  }
}
