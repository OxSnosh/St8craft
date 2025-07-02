# 🏗 Scaffold-ETH 2

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd my-dapp-example
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contracts in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`


## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.



specVersion: 0.0.4
description: CountryMinter
repository: https://github.com/scaffold-eth/se-2/packages/subgraph/
schema:
  file: ./src/schema.graphql
dataSources:
  - kind: ethereum/contract
    name: CountryMinter
    network: base
    source:
      abi: CountryMinter
      address: "0xBd46eA737E6999A24B71D48c1435D6aFE3812c65"
      startBlock: 32300000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - Nation
      abis:
        - name: CountryMinter
          file: ./abis/base_CountryMinter.json
      eventHandlers:
        - event: NationCreated(string,string,indexed uint256,address)
          handler: handleNationCreated
      file: ./src/mapping.ts
  - kind: ethereum/contract
    name: WarContract
    network: base
    source:
      abi: WarContract
      address: "0xb4E906f71f3504Db3Df26DFE08D2048e393D9cF7"
      startBlock: 32300000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - War
      abis:
        - name: WarContract
          file: ./abis/base_WarContract.json
      eventHandlers:
        - event: WarDeclared(indexed uint256,indexed uint256,indexed uint256)
          handler: handleWarDeclared
      file: ./src/warMapping.ts
  - kind: ethereum/contract
    name: CruiseMissileContract
    network: base
    source:
      abi: CruiseMissileContract
      address: "0xAc13d83FC189A17140f996Bf106E53c4A444Ba2e"
      startBlock: 32300000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - CruiseMissileAttack
      abis:
        - name: CruiseMissileContract
          file: ./abis/base_CruiseMissileContract.json
      eventHandlers:
        - event: CruiseMissileAttackResults(indexed uint256,indexed uint256,indexed
            uint256,bool,uint256,uint256)
          handler: handleCruiseMissileAttackResults
      file: ./src/cruiseMissileMapping.ts
  - kind: ethereum/contract
    name: NukeContract
    network: base
    source:
      abi: NukeContract
      address: "0x72909b2b9b9C49D377Dda51d6F31F308f2bBbaDB"
      startBlock: 32300000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - NukeAttack
      abis:
        - name: NukeContract
          file: ./abis/base_NukeContract.json
      eventHandlers:
        - event: NukeAttackEvent(indexed uint256,indexed uint256,indexed
            uint256,uint256,bool)
          handler: handleNukeAttackResults
      file: ./src/nukeMapping.ts
  - kind: ethereum/contract
    name: SpyOperationsContract
    network: base
    source:
      abi: SpyOperationsContract
      address: "0x532229d3CD62778Bddd53839459Ddc156808E124"
      startBlock: 32300000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - SpyOperation
      abis:
        - name: SpyOperationsContract
          file: ./abis/base_SpyOperationsContract.json
      eventHandlers:
        - event: SpyAttackResults(indexed uint256,indexed uint256,indexed
            uint256,bool,uint256)
          handler: handleSpyOperation
      file: ./src/spyOperationMapping.ts
  - kind: ethereum/contract
    name: AdditionalAirBattle
    network: base
    source:
      abi: AdditionalAirBattle
      address: "0x7043cdD43C24480b31171f054fdd8498E61023e1"
      startBlock: 32300000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - SpyOperation
      abis:
        - name: AdditionalAirBattle
          file: ./abis/base_AdditionalAirBattle.json
      eventHandlers:
        - event: AirBattleFulfilled(indexed uint256,indexed uint256,indexed
            uint256,uint256[],uint256[],uint256[],uint256,uint256,uint256)
          handler: handleAirBattle
      file: ./src/airBattleMapping.ts
  - kind: ethereum/contract
    name: NavalAttackContract
    network: base
    source:
      abi: NavalAttackContract
      address: "0xd59dd7E0C02628B3e2CF4A0F850653174B4De526"
      startBlock: 32300000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - NavyAttack
      abis:
        - name: NavalAttackContract
          file: ./abis/base_NavalAttackContract.json
      eventHandlers:
        - event: NavalAttackComplete(uint256[],uint256[],uint256)
          handler: handleNavyAttack
      file: ./src/navyAttackMapping.ts
  - kind: ethereum/contract
    name: BreakBlocadeContract
    network: base
    source:
      abi: BreakBlocadeContract
      address: "0x451Bd367e741cf2daA7af4A426F6Dc6E744F6F2d"
      startBlock: 32300000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - BreakBlockade
      abis:
        - name: BreakBlocadeContract
          file: ./abis/base_BreakBlocadeContract.json
      eventHandlers:
        - event: BreakBlockadeComlpete(uint256[],uint256,uint256[],uint256,uint256)
          handler: handleBreakBlockade
      file: ./src/breakBlockadeMapping.ts
  - kind: ethereum/contract
    name: NavalBlockadeContract
    network: base
    source:
      abi: NavalBlockadeContract
      address: "0xbACDb096799884Fc79Cf26BD6243d7A8f3103854"
      startBlock: 32300000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - BreakBlockade
      abis:
        - name: NavalBlockadeContract
          file: ./abis/base_NavalBlockadeContract.json
      eventHandlers:
        - event: BlockadeCompleted(uint256,uint256,uint256,uint256)
          handler: handleBlockade
      file: ./src/blockadeMapping.ts
  - kind: ethereum/contract
    name: Messenger
    network: base
    source:
      abi: Messenger
      address: "0xe0B173787565f1E48252a029FBbc6b5C7b0933BB"
      startBlock: 32300000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - Message
        - Post
      abis:
        - name: Messenger
          file: ./abis/base_Messenger.json
      eventHandlers:
        - event: MessageSent(indexed uint256,indexed uint256,string,uint256)
          handler: handleMessage
        - event: PostSent(indexed uint256,string,uint256)
          handler: handlePost
      file: ./src/messengerMapping.ts
  - kind: ethereum/contract
    name: GroundBattleContract
    network: base
    source:
      abi: GroundBattleContract
      address: "0xd11Ab091c07bd19Ebbf500083C1cAB5F8fB7ca84"
      startBlock: 32300000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - GroundBattle
      abis:
        - name: GroundBattleContract
          file: ./abis/base_GroundBattleContract.json
      eventHandlers:
        - event: GroundBattleResultsEvent(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)
          handler: handleGroundBattle
      file: ./src/groundBattleMapping.ts