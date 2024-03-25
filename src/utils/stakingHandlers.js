import { ethers } from "ethers";

import contractModules from "src/Contracts";
// Utils
const { contractAddresses, contractABIs} = contractModules;
const { stakingContractAddress, tokenContractAddress } = contractAddresses;
const { StakingContractABI, UnibitContractABI } = contractABIs;

export const getDataForStaking = async(walletAccount, fetchItem, balance) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);
  let result = "";
  if (fetchItem === "staked") {
    result = (await stakingContract.getStaked(walletAccount.address)).toString();
  } else if (fetchItem === "apy") {
    result = (await stakingContract.getAPR()).toString();
  } else if (fetchItem === "earned") {
    result = (await stakingContract.earned(walletAccount.address)).toString();
  } else if (fetchItem ===  "withdrawn") {
    result = (await stakingContract.getClaimed(walletAccount.address)).toString();
  }
  return result;
}

export const stakeUIBT = async(amountin) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);
  const tokenContract = new ethers.Contract(tokenContractAddress, UnibitContractABI, signer);
  //approve
  const approve = await tokenContract.approve(stakingContractAddress, ethers.utils.parseEther(amountin));
  await approve.wait();
  // stake
  const action = await stakingContract.stake(ethers.utils.parseEther(amountin));
  await action.wait();
}

export const unStake = async(amount) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);
   // unstake
   const action = await stakingContract.withdraw(ethers.utils.parseEther(amount));
   await action.wait();
}

export const claimReward = async() => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);
   // unstake
   const action = await stakingContract.claimReward();
   await action.wait();
}

export const setAPR = async(apr) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);

   // unstake
   const action = await stakingContract.setAPR(apr * 100);
   await action.wait();
}

export const isOwner = async() => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);

   // unstake
   const result = await stakingContract.isOwner();
   return result;
}
