import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();

    return throwError(() => ({
      message: exception.message,
      statusCode: status || HttpStatus.INTERNAL_SERVER_ERROR,
    }));
  }
}
