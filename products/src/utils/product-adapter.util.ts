import {
  IProduct,
  IProductV2,
  ProductVersion,
  ProductVariation,
  IProductV1,
} from 'src/types';

interface IProductAdapter {
  format: (product: ProductVariation<ProductVersion, any>) => IProduct;
}

class ProductV2Adapter implements IProductAdapter {
  format(productV2: IProductV2): IProduct {
    const { productName: name, desc: description, ...restData } = productV2;

    return {
      ...restData,
      description,
      name,
    };
  }
}

class ProductV1Adapter implements IProductAdapter {
  format({ version, ...prodRest }: IProductV1): IProduct {
    return prodRest;
  }
}

export class ProductAdapter implements IProductAdapter {
  format({ version, ...product }: ProductVariation<ProductVersion, any>) {
    const variationCls =
      version === 'V1'
        ? ProductV1Adapter
        : version === 'V2'
          ? ProductV2Adapter
          : ProductV1Adapter;

    return new variationCls().format(product);
  }
}
