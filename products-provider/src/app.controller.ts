import { Controller, Get, Response as Res } from '@nestjs/common';
import { Response } from 'express';

import { AppService, SSEService } from './services';

@Controller('products')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sseService: SSEService,
  ) {}

  @Get('/')
  getProducts(@Res() res: Response) {
    const products = this.appService.getProducts();
    res.send(products);
  }

  @Get('steal-products')
  streamEvents(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    this.sseService.getSseStream().subscribe((data) => {
      res.write(data);
    });
  }
}
