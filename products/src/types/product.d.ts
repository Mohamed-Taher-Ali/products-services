type ProductVersion = 'V1' | 'V2';

type Price = { value: number; date: Date };

type BaseProduct = {
  id: number;
  price: Price;
  currency: string;
  lastUpdated: Date;
  availability: boolean;
};

export type ProductVariation<
  Version extends ProductVersion,
  Body extends {},
> = BaseProduct &
  Body & {
    version: Version;
  };

export type IProductV1 = ProductVariation<
  'V1',
  {
    description: string;
    name: string;
  }
>;

export type IProduct = Omit<IProductV1, 'version'>;

export type IProductV2 = ProductVariation<
  'V2',
  {
    productName: string;
    desc: string;
  }
>;
