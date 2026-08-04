import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHexColorToProductVariants1785856325599 implements MigrationInterface {
    name = 'AddHexColorToProductVariants1785856325599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "hexColor" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "hexColor"`);
    }

}
