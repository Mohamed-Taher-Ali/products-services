import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';

import { ProductService } from './product.service';

@Injectable()
export class ProductsCronService {
  private readonly logger = new Logger(ProductsCronService.name);

  constructor(private productService: ProductService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleFetching() {
    this.logger.debug('[Fetching] Cron job running every 10 seconds');
    this.productService.collectProducts().then((products) => {
      this.productService.upsertProducts(products);
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async cleanupPrices() {
    this.logger.debug('[cleanup] Cron job running every day-midnight seconds');
    this.productService
      .cleanupProductsPrices(5)
      .catch((err) => console.log(err));
  }
}
