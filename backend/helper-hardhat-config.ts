const config = {
    31337: {
      name: "localhost",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one is ETH/USD contract on Kovan
    42: {
      name: "kovan",
      ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    },
  }

const INITIAL_SUPPLY = "30000000000000000000000000000" 
  
const developmentChains = ["hardhat", "localhost"]

const networkConfig: any = {
  default: {
      name: "hardhat",
      keepersUpdateInterval: "30",
  },
  31337: {
      name: "localhost",
      subscriptionId: "588",
      gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
      keepersUpdateInterval: "30",
      callbackGasLimit: "5000000", // 5,000,000 gas
      vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
  },
  5: {
      name: "goerli",
      subscriptionId: "6926",
      gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei
      keepersUpdateInterval: "30",
      callbackGasLimit: "500000", // 500,000 gas
      vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
  },
  84532: {
      name: "base_sepolia",
      subscriptionId: "14575755735136966189289469209709711428838312231747918522235102863165543358356",
      gasLane: "0x9e1344a1247c8a1785d0a4681a27152bffdb43666ae5bf7d14d24a5efd44bf71", // 30 gwei
      keepersUpdateInterval: "30",
      callbackGasLimit: "2500000", // 2,500,000 gas
      vrfCoordinatorV2: "0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE",
  },
  1: {
      name: "mainnet",
      keepersUpdateInterval: "30",
  },
}

const VERIFICATION_BLOCK_CONFIRMATIONS = 2

export {
  config,
  INITIAL_SUPPLY,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  developmentChains,
  networkConfig
}