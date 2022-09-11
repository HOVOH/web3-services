import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MigrationService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit(): Promise<any> {
    const results = await this.dataSource.runMigrations();
  }
}
