import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const page = req.query.page ? Math.max(Number(req.query.page), 1) : 1;
    const limit = req.query.limit ? Math.max(Number(req.query.limit), 1) : 10;
    const offset = this.getOffset(page, limit);

    req.offset = offset;
    req.limit = limit;

    delete req.query.limit;
    delete req.query.page;
    next();
  }

  getOffset(page: number, limit: number): number {
    return (Math.max(page, 1) - 1) * Math.max(limit, 1);
  }
}
