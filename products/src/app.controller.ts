import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { ProductService, SSEService } from './services';
import { ProductQueryDto } from './dtos';

@Controller('products')
export class AppController {
  constructor(
    private readonly productService: ProductService,
    private readonly sseService: SSEService,
  ) {}

  @Get('stream')
  streamEvents(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    this.sseService.getSseStream().subscribe((data) => {
      res.write(data);
    });
  }

  @Get('/')
  async getProducts(
    @Res() res: Response,
    @Req() { offset, limit }: Request,
    @Query() query: ProductQueryDto,
  ) {
    res.send(await this.productService.getProducts(query, { offset, limit }));
  }

  @Get('/:id')
  async getProduct(@Res() res: Response, @Param('id') id: string) {
    res.send(await this.productService.getProduct(+id));
  }
}
