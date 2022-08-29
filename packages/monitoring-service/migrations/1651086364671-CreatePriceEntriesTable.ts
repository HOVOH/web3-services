import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePriceEntriesTable1651086364671
  implements MigrationInterface
{
  TABLE_NAME = 'price_entries';
  TIME_COLUMN_NAME = 'at';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: this.TABLE_NAME,
      columns: [
        {
          name: 'price_source_id',
          type: 'int',
        },
        {
          name: this.TIME_COLUMN_NAME,
          type: 'timestamp',
        },
        {
          name: 'usd_value',
          type: 'bigint',
        },
        {
          name: 'value',
          type: 'varchar(30)',
        },
      ],
    });
    await queryRunner.createTable(table, true);
    await queryRunner.query(
      `SELECT create_hypertable('${this.TABLE_NAME}','${this.TIME_COLUMN_NAME}');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
