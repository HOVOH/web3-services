import {AssetsModule} from "../assets/assets.module";
import {EvmModule} from "../evm/evm.module";
import {Module} from "@nestjs/common";

@Module({
  imports: [
    EvmModule, AssetsModule
  ]
})
export class Uniswapv3Module {}
