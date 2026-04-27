import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const method = req.method;
    const url = req.originalUrl;

    // Важно: body может быть undefined на GET — сделаем безопасно
    const body = req.body ?? {};

    console.log(`[LoggerMiddleware] ${method} ${url}`);
    console.log(`[LoggerMiddleware] Body: ${JSON.stringify(body)}`);

    // КРИТИЧНО: без next() всё зависнет
    next();
  }
}