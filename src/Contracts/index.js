// testnet address and artifacts
import addresses from "src/Contracts/ArbitrumGoerli/contract_addresses.json";
import UnibitContractABI from "src/Contracts/ArbitrumGoerli/UIBT.json";
import StakingContractABI from "src/Contracts/ArbitrumGoerli/StakingContract.json";
// mainnet
import addressesMain from "src/Contracts/ArbitrumOne/contract_addresses.json";
import UnibitContractABIMain from "src/Contracts/ArbitrumOne/UIBT.json";
import StakingContractABIMain from "src/Contracts/ArbitrumOne/StakingContract.json";

// for test net
let contractABIs = {
  UnibitContractABI: UnibitContractABI.abi,
  StakingContractABI: StakingContractABI.abi
}
let contractAddresses = addresses;

// check env and update if production
if (process.env.Environment === "production") {
  contractABIs = {
    UnibitContractABI: UnibitContractABIMain.abi,
    StakingContractABI: StakingContractABIMain.abi
  }
  contractAddresses = addressesMain
}

// export modules
export default {
  contractABIs,
  contractAddresses
}