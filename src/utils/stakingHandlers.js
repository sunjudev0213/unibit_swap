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
  if (fetchItem === "userStaking") {
    result = (await stakingContract.userStakingStatus());
  } else if (fetchItem === "rates") {
    result = (await stakingContract.getRewardRates());
  } else if (fetchItem === "earned") {
    result = (await stakingContract.earned(walletAccount.address));
  }
  return result;
}

export const stakeUIBT = async(amountin, type) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);
  const tokenContract = new ethers.Contract(tokenContractAddress, UnibitContractABI, signer);
  //approve
  const approve = await tokenContract.approve(stakingContractAddress, ethers.utils.parseEther(amountin));
  await approve.wait();
  // stake
  const action = await stakingContract.stake(ethers.utils.parseEther(amountin), type);
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

export const setAPR = async(type, rate) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);

   // unstake
   const action = await stakingContract.updateRewardRate(type, rate);
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
