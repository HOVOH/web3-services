/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { invariant } from 'ts-invariant';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * ### Instructions
 * 1. edit externalContracts.config.ts to add your external contract addresses.
 * 2. edit `appContractsConfig` function below and add them to the list
 * 3. run `yarn contracts:build` to generate types for contracts
 * 4. run `yarn deploy` to generate hardhat_contracts.json
 *
 * ### Summary
 * - called  by useAppContracts
 * @returns
 */
export const appContractsConfig = () => {
  try {
    const result = {
      // --------------------------------------------------
      // 🙋🏽‍♂️ Add your hadrdhat contracts here
      // --------------------------------------------------
      /*      YourContract: createConnectorForHardhatContract(
        'YourContract',
        hardhatContracts.YourContract__factory,
        hardhatDeployedContractsJson
      ),

      YourNFT: createConnectorForHardhatContract(
        'YourNFT',
        hardhatContracts.YourNFT__factory,
        hardhatDeployedContractsJson
      ),*/
      // --------------------------------------------------
      // 🙋🏽‍♂️ Add your external contracts here, make sure to define the address in `externalContractsConfig.ts`Í
      // --------------------------------------------------
      // DAI: createConnectorForExternalContract('DAI', DAI__factory, externalContractsAddressMap),
      // --------------------------------------------------
      // 🙋🏽‍♂️ Add your external abi here (unverified contracts)`
      // --------------------------------------------------
      // YourContract: createConnectorForExternalAbi(
      //   'YourContract',
      //   {
      //     [TARGET_NETWORK_INFO.chainId]: {
      //       address: 'xxx',
      //       chainId: TARGET_NETWORK_INFO.chainId,
      //     },
      //   },
      //   hardhatContracts.YourContract__factory.abi,
      //   hardhatContracts.YourContract__factory.connect
      // ),
    } as const;

    return result;
  } catch (e) {
    invariant.error(
      '❌ appContractsConfig: ERROR with loading contracts please run `yarn contracts:build or yarn contracts:rebuild`.  Then run `yarn deploy`!'
    );
    invariant.error(e);
  }

  return undefined;
};
