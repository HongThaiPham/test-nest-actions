import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ACTIONS_CORS_HEADERS } from '@solana/actions';

@Injectable()
export class ActionHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        response.setHeader(
          'Access-Control-Allow-Origin',
          ACTIONS_CORS_HEADERS['Access-Control-Allow-Origin'],
        );
        response.setHeader(
          'Access-Control-Allow-Methods',
          ACTIONS_CORS_HEADERS['Access-Control-Allow-Methods'],
        );
        response.setHeader(
          'Access-Control-Allow-Headers',
          ACTIONS_CORS_HEADERS['Access-Control-Allow-Headers'],
        );
        response.setHeader(
          'Content-Type',
          ACTIONS_CORS_HEADERS['Content-Type'],
        );
        return data;
      }),
    );
  }
}
