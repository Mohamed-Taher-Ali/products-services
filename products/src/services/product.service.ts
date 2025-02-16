import { Injectable } from '@nestjs/common';

import { IOffsetLimit, IProduct, Price } from 'src/types';
import { PrismaService } from 'src/modules';
import { ProductAdapter } from 'src/utils';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  collectProducts(): Promise<IProduct[]> {
    return new Promise((res, rej) => {
      const endpoints = process.env.FETCHING_ENDPOINTS.split(',');

      endpoints.map((endpoint) => {
        fetch(endpoint)
          .then((response) => response.json())
          .then((data) => {
            const products = data.map((prod) =>
              new ProductAdapter().format(prod),
            );

            res(products);
          })
          .catch((error) => {
            setTimeout(() => this.collectProducts(), 5000);
          });
      });
    });
  }

  async updateBulk(data: IProduct[]) {
    const query = `
      UPDATE "Product"
      SET
        "lastUpdated" = CASE ${data.map((_, i) => `WHEN id = $${i * 7 + 1} THEN $${i * 7 + 2}`).join(' ')} END,
        "availability" = CASE ${data.map((_, i) => `WHEN id = $${i * 7 + 1} THEN $${i * 7 + 3}`).join(' ')} END,
        "description" = CASE ${data.map((_, i) => `WHEN id = $${i * 7 + 1} THEN $${i * 7 + 4}`).join(' ')} END,
        "currency" = CASE ${data.map((_, i) => `WHEN id = $${i * 7 + 1} THEN $${i * 7 + 5}`).join(' ')} END,
        "name" = CASE ${data.map((_, i) => `WHEN id = $${i * 7 + 1} THEN $${i * 7 + 6}`).join(' ')} END,
        "price" = CASE ${data
          .map(
            (_, i) => `
          WHEN id = $${i * 7 + 1} 
          THEN COALESCE("price", '[]'::jsonb) || $${i * 7 + 7}::jsonb
        `,
          )
          .join(' ')} END
      WHERE id IN (${data.map((_, i) => `$${i * 7 + 1}`).join(', ')});
    `;

    const values = data.flatMap((p) => [
      p.id,
      new Date(p.lastUpdated),
      p.availability,
      p.description,
      p.currency,
      p.name,
      JSON.stringify([p.price]),
    ]);

    try {
      await this.prisma.$executeRawUnsafe(query, ...values);
      return data.map(({ id }) => id);
    } catch (error) {
      return [];
    }
  }

  async upsertProducts(products: IProduct[]): Promise<number[]> {
    return new Promise((res, rej) => {
      this.prisma.product
        .createManyAndReturn({
          select: { id: true },
          skipDuplicates: true,
          data: products.map(({ price, ...prod }) => ({
            price: [price],
            ...prod,
          })),
        })
        .then((createdProducts) => {
          const createdIds = createdProducts.map(({ id }) => id);
          const productsWillBeUpdated = products.filter(
            ({ id }) => !createdIds.includes(id),
          );

          if (!productsWillBeUpdated.length) return res(createdIds);

          this.updateBulk(productsWillBeUpdated).then((updatedProductsIds) => {
            const upsertedIds = createdIds.concat(updatedProductsIds);
            console.log({ updatedProductsIds });

            res(upsertedIds);
          });
        });
    });
  }

  async cleanupProductsPrices(limit: number) {
    await this.prisma.$executeRawUnsafe(`
      UPDATE "Product"
      SET "price" = (
        SELECT jsonb_agg(elem)
        FROM (
          SELECT elem
          FROM jsonb_array_elements("Product"."price") AS t(elem)
          ORDER BY (elem->>'timestamp')::timestamptz DESC
          LIMIT ${limit}
        ) AS subquery
      )
      WHERE jsonb_array_length("Product"."price") > ${limit};
    `);
  }

  getProduct(id: number) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  handlePriceQuery(price?: Partial<Price>) {
    return Object.entries(price || {}).reduce(
      (acc, [key, val]) => ({
        ...acc,
        price: { path: [key], equals: val },
      }),
      {},
    );
  }

  getProducts(
    { price, ...query }: Partial<IProduct>,
    { offset, limit }: IOffsetLimit,
  ) {
    const priceQuery = this.handlePriceQuery(price);
    return this.prisma.product.findMany({
      where: {
        ...priceQuery,
        ...query,
      },
      skip: offset,
      take: limit,
    });
  }
}
