import { Injectable } from '@nestjs/common';

import { ProductService } from './product.service';

@Injectable()
export class AppService {
  constructor(private readonly productService: ProductService) {}

  getProducts() {
    return this.productService.findProducts();
  }
}
