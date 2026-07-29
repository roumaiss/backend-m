import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductVariantsAndCategoryRework1785360017339 implements MigrationInterface {
  name = 'ProductVariantsAndCategoryRework1785360017339';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subcategories" DROP CONSTRAINT "FK_d1fe096726c3c5b8a500950e448"`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_variants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "shade" character varying, "color" character varying, "volume" character varying, "price" numeric(10,2) NOT NULL, "stockQuantity" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategories" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "shade"`);
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "sizeOrVolume"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "stockQuantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "categoryId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_f515690c571a03400a9876600b5" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_f515690c571a03400a9876600b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "categoryId"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "stockQuantity" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "price" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "sizeOrVolume" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "shade" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategories" ADD "categoryId" uuid NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "product_variants"`);
    await queryRunner.query(
      `ALTER TABLE "subcategories" ADD CONSTRAINT "FK_d1fe096726c3c5b8a500950e448" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
