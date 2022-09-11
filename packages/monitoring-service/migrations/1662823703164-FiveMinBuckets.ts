import { MigrationInterface, QueryRunner } from 'typeorm';

export class FiveMinBuckets1662823703164 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE MATERIALIZED VIEW five_min_buckets\n' +
        'WITH (timescaledb.continuous) AS\n' +
        '\tSELECT\n' +
        "\t    time_bucket('5 min', at) AS bucket,\n" +
        '\t    price_source_id,\n' +
        '\t    cast(FIRST(usd_value , at) as decimal)/1000000 AS "open",\n' +
        '\t    cast(MAX(usd_value) as decimal)/1000000 AS high,\n' +
        '\t    cast(MIN(usd_value) as decimal)/1000000 AS low,\n' +
        '\t    cast(LAST(usd_value, at) as decimal)/1000000 AS "close"\n' +
        '\tFROM price_entries \n' +
        '\tGROUP BY bucket, price_source_id \n' +
        '\tWITH NO DATA',
    );
    await queryRunner.query(
      "SELECT add_continuous_aggregate_policy('five_min_buckets',\n" +
        "    start_offset => INTERVAL '30 min',\n" +
        "    end_offset => INTERVAL '0 min',\n" +
        "    schedule_interval => INTERVAL '5 min');",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropView('five_min_buckets');
  }
}
