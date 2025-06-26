import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ulid } from 'ulid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(LoggerMiddleware.name);
  use(request: Request, response: Response, next: NextFunction) {
    const start = new Date().getTime();
    const { ip, method, originalUrl } = request;

    response.on('finish', () => {
      const { statusCode } = response;
      const { user } = request;
      const elapsed = new Date().getTime() - start;
      let user_login = 'NO AUTH';

      if (user?.gamer_username) user_login = user.gamer_username;

      this.logger.log(
        `${ulid()} - ${method} - '${originalUrl}' - ${statusCode} - (${user_login} - ${ip}) - +${elapsed}ms`,
      );
    });

    next();
  }
}
