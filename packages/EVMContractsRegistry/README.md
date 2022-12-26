# EVM Contracts Registry

Bundle all your bindings in an easy to use package that let's you abstract contract initialization and addresses

## How to use a library built with EVM Contracts Registry

### Providers Registry

The providers registry is an object containing all your rpc urls. You can instantiate your own or
use the one provided with the library with public RPCs:

`import { providers } from '@hovoh/evmcontractsregistry';`

You can add networks with the addNetwork function to the default provider.
If you want to use write function, you can specify your private key using setPrivateKey function.

### Contracts Registry

The Contracts Registry are mappings the addresses with a function to instanciate 
the EthersJs Contract object. 

Named bindings are contracts available on all networks.

In this case we use factories from Typechain generated using [typechain for ethers with multicall](https://github.com/HOVOH/TypeChain/tree/master/packages/target-ethers-multicall)

```typescript
import {
  contract
} from "@hovoh/evmcontractsregistry";

const deployedAtBlock = 999999;
const ethereumMainnet = {
    myErc20Token: contract("0xYourContractAddress", ERC20__factory.connect, ERC20__factory.multicall, deployedAtBlock),
}

const optimismMainnet = {
    myErc20Token: contract("0xYourContractAddress", ERC20__factory.connect, ERC20__factory.multicall, deployedAtBlock),
    staking: contract("0xStakingAddress", Staking__factory.connect, Staking__factory.multicall, 10000)
}

const bindings = {
  ERC20: contract("0x0", ERC20__factory.connect, ERC20__factory.multicall, 0)
}
```

### Network Contracts Registry

Once you have a mapping of contracts for each network you can instantiate the NetworkContractsRegistry to map
the contracts registries to a network.
```typescript
export interface MyAPINetworksMapping {
    [Network.MAINNET]: typeof ethereumMainnet,
    [Network.OPTIMISM]: typeof optimismMainnet
}

export const myApiContracts = new NetworksContractsRegistry<IMaiPeripherals, typeof bindings>()
myApiContracts.addNetwork(Network.MAINNET, ethereumMainnet);
myApiContracts.addNetwork(Network.OPTIMISM, optimismMainnet);
myApiContracts.setNamedFactories(bindings)
```

### Contracts Factory

The Contracts Factory uses the Providers Registry and the NetworkContractsRegistry to instantiate
contracts with typings support.

```typescript
const bundledApi = new ContractFactory(providers, myApiContracts)
```

### Using the ContractFactory

Querying a contract:
```typescript
const myErc20Token = bundledApi.forNetwork(Network.OPERA_MAINNET).getContractInstance("myErc20Token");
const symbol = myErc20Token.symbol()
```

Using multicall to batch calls:
```typescript
const multicallResults = bundledApi.forNetwork(Network.OPERA_MAINNET).multicall((get) => [
  get("myErc20Token").symbol(),
  get("myErc20Token").name()
])
```


