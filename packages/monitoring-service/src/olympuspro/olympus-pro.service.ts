import { EvmService } from '../evm/evm.service';
import { Injectable } from '@nestjs/common';
import { OlympusProAPI, initOlympusProApi } from '@hovoh/olympuspro-api';

@Injectable()
export class OlympusProService {
  api: OlympusProAPI;

  constructor(evmService: EvmService) {
    this.api = initOlympusProApi(evmService.getProviders());
  }
}
