import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          return throwError(() => ({
            status: 0,
            msg: error.message,
            data: [],
          }));
        } else {
          // For unexpected errors
          const serverError = new InternalServerErrorException();
          return throwError(() => ({
            status: 0,
            msg: 'Internal server error',
            data: [],
          }));
        }
      }),
    );
  }
}
