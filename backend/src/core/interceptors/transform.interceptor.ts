import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If data is already in our format, return it as is
        if (
          data &&
          typeof data === 'object' &&
          'status' in data &&
          'msg' in data &&
          'data' in data
        ) {
          return data;
        }

        // Transform the response into our standard format
        return {
          status: 1,
          msg: 'Success',
          data: Array.isArray(data) ? data : data ? [data] : [],
        };
      }),
    );
  }
}
