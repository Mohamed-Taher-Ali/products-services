import { Injectable } from '@nestjs/common';

import { generateUniqueNumbers, getRandomInt } from 'src/utils';
import { IProducts, IProductV1, IProductV2 } from 'src/types';
import { ProductObserverService } from '.';
import { SSEService } from './SSE.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly sseService: SSEService,
    private readonly productObserverService: ProductObserverService,
  ) {}

  protected onModuleInit() {
    this.productObserverService.addListener((prods) => this.updateProductsListener(prods));

    setInterval(() => {
      this.productObserverService.updateProducts(this.updateProductList(10));
      console.log(`products sent [${this.productObserverService.products.map(({ id }) => id)}]`);
    }, 3000);
  }

  private generateIProductV1(id: number): IProductV1 {
    const randomBoolean = !!(getRandomInt(0, 1) % 2);
    const randomPrice = getRandomInt(100, 20000);

    const name = `product-${id}`;
    const currency = id % 2 ? 'USD' : 'EGP';
    const description = `description for our ${name}`;

    return {
      price: { value: randomPrice, date: new Date() },
      availability: randomBoolean,
      lastUpdated: new Date(),
      version: 'V1',
      description,
      currency,
      name,
      id,
    };
  }

  private generateIProductV2(id: number): IProductV2 {
    const { description: desc, name: productName, ...productData } = this.generateIProductV1(id);

    return {
      ...productData,
      version: 'V2',
      productName,
      desc,
    };
  }

  private updateProductList(count: number) {
    return generateUniqueNumbers(count, Math.pow(count, 2)).map((id) =>
      id <= 50 ? this.generateIProductV1(id) : this.generateIProductV2(id),
    );
  }

  updateProductsListener(products: IProducts) {
    this.sseService.sendMessage({ productIds: products });
  }

  findProducts() {
    return this.productObserverService.products;
  }
}
