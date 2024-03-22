import { ethers } from "ethers";

import contractModules from "src/Contracts";
// Utils

const { contractAddresses, contractABIs} = contractModules;
const { stakingContractAddress } = contractAddresses;
const { StakingContractABI } = contractABIs;

export const getDataForStaking = async(walletAccount, fetchItem, balance) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);
  let result = "";
  if (fetchItem === "staked") {
    result = (await stakingContract.getStaked(walletAccount.address)).toString();
  } else if (fetchItem === "apy") {
    let param = 0;
    if (balance === 0) param = 1000;
    param = ethers.utils.parseEther(param.toString());
    result = (await stakingContract.getAPY(param)).toString();
  } else if (fetchItem === "earned") {
    result = (await stakingContract.earned(walletAccount.address)).toString();
  } else if (fetchItem ===  "withdrawn") {
    result = (await stakingContract.getClaimed(walletAccount.address)).toString();
  }

  return result;
}
