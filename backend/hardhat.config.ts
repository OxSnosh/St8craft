import "@nomiclabs/hardhat-waffle"
// import "@nomiclabs/hardhat-etherscan"
import "hardhat-deploy"
import "solidity-coverage"
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"
import "dotenv/config"
import "@nomiclabs/hardhat-solhint"
import "@typechain/hardhat"
import "solidity-docgen"
import 'solidity-coverage'
import { HardhatUserConfig } from "hardhat/types"
import "./tasks/set_religion_and_govt";
import "./tasks/set_resources";
import "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify"


/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const MAINNET_RPC_URL =
  process.env.MAINNET_RPC_URL ||
  process.env.ALCHEMY_MAINNET_RPC_URL ||
  "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const RINKEBY_RPC_URL =
  process.env.RINKEBY_RPC_URL ||
  "https://eth-rinkeby.alchemyapi.io/v2/your-api-key"
const KOVAN_RPC_URL =
  process.env.KOVAN_RPC_URL || "https://eth-kovan.alchemyapi.io/v2/your-api-key"
const POLYGON_MAINNET_RPC_URL =
  process.env.POLYGON_MAINNET_RPC_URL ||
  "https://polygon-mainnet.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY = process.env.PRIVATE_KEY

// optional
const MNEMONIC = process.env.MNEMONIC || "your mnemonic"

// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY =
  process.env.ETHERSCAN_API_KEY || "Your etherscan API key"
const POLYGONSCAN_API_KEY =
  process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key"
const REPORT_GAS = process.env.REPORT_GAS || false



const config = {
  solidity: {
    compilers: [
      {
        version: "0.8.7"
      },
      {
        version: "0.8.17"
      },
      {
        version: "0.7.6"
      },
      {
        version: "0.4.24"
      },
      {
        version: "0.4.11"
      },
    ],
  },
  w3f: {
    rootDir: "./web3-functions",
    debug: false,
    networks: ["hardhat","blueberry","blackberry"], //(multiChainProvider) injects provider for these networks
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // // If you want to do some forking, uncomment this
      // forking: {
      //   url: MAINNET_RPC_URL
      // }
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      chainId: 31337,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      url: "http://127.0.0.1:8545/"
    },
    // yarn hardhat coverage --network coverage (no node running on localhost:8545)
    coverage: { // for running solidity coverage tests
      chainId: 1337,
      url: "http://127.0.0.1:8545/"
    },
    base_sepolia: {
      url: "https://sepolia.base.org",
      chainId: 84532,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],

    },
    kovan: {
      url: KOVAN_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      //accounts: {
      //     mnemonic: MNEMONIC,
      // },
      saveDeployments: true,
      chainId: 42,
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      //   accounts: {
      //     mnemonic: MNEMONIC,  
      //   },
      saveDeployments: true,
      chainId: 4,
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      //   accounts: {
      //     mnemonic: MNEMONIC,
      //   },
      saveDeployments: true,
      chainId: 1,
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 137,
    },
    blueberry: {
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 88153591557,
      url: `https://rpc.arb-blueberry.gelato.digital`,
    },
    raspberry: {
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 123420111,
      url: `https://rpc.opcelestia-raspberry.gelato.digital`,
    },
    blackberry: {
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 94204209,
      url: `https://rpc.polygon-blackberry.gelato.digital`,
    },
  },
  etherscan: {
    // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
      rinkeby: ETHERSCAN_API_KEY,
      kovan: ETHERSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      baseSepolia: process.env.BASESCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "FTM",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  contractSizer: {
    runOnCompile: false,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
    user1: {
      default: 1,
    },
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
  docgen: {
    
  },
  sourcify: {
    enabled: true
  }
}

export default config;
