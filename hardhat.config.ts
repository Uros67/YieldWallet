import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@nomicfoundation/hardhat-ethers';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers'
import "dotenv/config";

const SEPOLIA_RPC_URL= process.env.SEPOLIA_RPC_URL;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;

const config: HardhatUserConfig = {
  solidity: {
    compilers:[
    {
      version: "0.8.20",
    },
    {
      version: "0.5.12",
    },
    {
      version: "0.5.0",
    }
  ]
  },
  mocha: {
    timeout: 100000000,
  },
  networks :{
    hardhat :{
      chainId: 31337,
      forking: {
        url: MAINNET_RPC_URL!,
      }
    },
    sepolia :{
      chainId: 11155111,
      url: SEPOLIA_RPC_URL,
      accounts: [`0x${METAMASK_PRIVATE_KEY}`],
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  namedAccounts: {
    deployer :{
      default: 0,
      1: 0,
    },
  },
};

export default config;
