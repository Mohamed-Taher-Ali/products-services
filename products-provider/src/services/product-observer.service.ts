import { Injectable } from '@nestjs/common';

import { IProducts } from 'src/types';

type IProductObserver = (product: IProducts) => void;

@Injectable()
export class ProductObserverService {
  private listeners: IProductObserver[] = [];
  private prods: IProducts = [];

  addListener(listener: IProductObserver) {
    this.listeners.push(listener);
  }

  updateProducts(products: IProducts) {
    this.prods = products;
    this.listeners.forEach((listener) => listener(this.prods));
  }

  get products() {
    return this.prods;
  }
}
