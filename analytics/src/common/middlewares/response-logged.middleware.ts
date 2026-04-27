import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ResponseLoggedMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    // "res event emitter" — логируем, когда ответ уже отправлен
    res.on('finish', () => {
      const ms = Date.now() - start;

      // baseUrl может быть пустым, originalUrl всегда норм
      const baseUrl = req.baseUrl || '';
      const statusCode = res.statusCode;

      console.log(
        `[ResponseLoggedMiddleware] baseUrl="${baseUrl}" url="${req.originalUrl}" status=${statusCode} time=${ms}ms`,
      );
    });

    next();
  }
}