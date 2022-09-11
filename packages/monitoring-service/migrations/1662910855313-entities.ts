import { MigrationInterface, QueryRunner } from 'typeorm';

export class Entities1662910855313 implements MigrationInterface {
  name = 'entities1662910855313';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "price_source" ("id" SERIAL NOT NULL, "address" character varying(42), "chainId" integer NOT NULL, "type" character varying NOT NULL, "assetId" integer NOT NULL, "denominatorId" integer, "priority" integer NOT NULL DEFAULT '0', "enabled" boolean NOT NULL DEFAULT false, "label" character varying, CONSTRAINT "REL_2f5c23c38fcb0c214ead9db249" UNIQUE ("denominatorId"), CONSTRAINT "PK_a90799459e9bed4023e3798cadb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2f811d3e15f855bbbea5ffd9fe" ON "price_source" ("address", "assetId", "chainId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "asset" ("id" SERIAL NOT NULL, "address" character varying(42) NOT NULL, "chainId" integer NOT NULL, "decimals" smallint, "symbol" character varying, "name" character varying, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b70c38c12d6a1c579f3e18d6e6" ON "asset" ("address", "chainId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "price_source" ADD CONSTRAINT "FK_a684a6e9d3c4d8b180037b2accc" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_source" ADD CONSTRAINT "FK_2f5c23c38fcb0c214ead9db2493" FOREIGN KEY ("denominatorId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "price_source" DROP CONSTRAINT "FK_2f5c23c38fcb0c214ead9db2493"`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_source" DROP CONSTRAINT "FK_a684a6e9d3c4d8b180037b2accc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b70c38c12d6a1c579f3e18d6e6"`,
    );
    await queryRunner.query(`DROP TABLE "asset"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2f811d3e15f855bbbea5ffd9fe"`,
    );
    await queryRunner.query(`DROP TABLE "price_source"`);
  }
}
