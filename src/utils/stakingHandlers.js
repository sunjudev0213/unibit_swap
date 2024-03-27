import { ethers } from "ethers";

import contractModules from "src/Contracts";
// Utils
const { contractAddresses, contractABIs } = contractModules;
const { stakingContractAddress, tokenContractAddress } = contractAddresses;
const { StakingContractABI, UnibitContractABI } = contractABIs;

// currently rates is only the one used... others deprecated as client demand changed
export const getDataForStaking = async (walletAccount, fetchItem, balance) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);
    let result = "";
    if (fetchItem === "userStaking") {
        result = await stakingContract.userStakingStatus();
    } else if (fetchItem === "rates") {
        result = await stakingContract.getRewardRates();
    } else if (fetchItem === "earned") {
        result = await stakingContract.earned(walletAccount.address);
    }
    return result;
};

export const stakeUIBT = async (amountin, type) => {
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
};

export const getLockTimes = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);

    // get the array of lockTimes
    const result = await stakingContract.userStakingStatusRecords();
    return result;
};

export const getDetails = async (lockTime) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);

    // get the staking details for the given lockTime
    const result = await stakingContract.userStakingRecordDetails(lockTime);
    return result;
};

export const claimAndWithdraw = async (lockTime) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);

    // claim reward and withdraw for the staking record with given lockTime
    const action = await stakingContract.claimRewardAndUnstake(lockTime);
    await action.wait();
};

/***************************************************************************************************************************************
 * The following methods are all deprecated and not used, as client requirements have been changed
 * **************************************************************************************************************************************/

// Not used for now, used for dynamic claim
export const claimReward = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);
    // unstake
    const action = await stakingContract.claimReward();
    await action.wait();
};

// Not used for now
export const setAPR = async (type, rate) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);

    // unstake
    const action = await stakingContract.updateRewardRate(type, rate);
    await action.wait();
};

// Not used for now, used for dynamic unstake
export const unStake = async (amount) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);
    // unstake
    const action = await stakingContract.withdraw(ethers.utils.parseEther(amount));
    await action.wait();
};

export const isOwner = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(stakingContractAddress, StakingContractABI, signer);

    // unstake
    const result = await stakingContract.isOwner();
    return result;
};
