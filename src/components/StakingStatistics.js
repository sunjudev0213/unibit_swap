import React, { useState, useContext, useEffect } from "react";
// Material
import { Box, Typography } from "@mui/material";
// Context
import { AppContext } from "src/AppContext";
// Utils
import { getDataForStaking } from "src/utils/stakingHandlers";
import { ethers } from "ethers";

export default function StakingStatistics({ balance, reward, setReward, staked, setStaked }) {
  const { openSnackbar, darkMode, walletContext, loading, setLoading } = useContext(AppContext);
  const { walletAccount } = walletContext;

  const [APY, setAPY] = useState(0);
  const [claimed, setClaimed] = useState(0);
  const [earned, setEarned] = useState(0);
  const getDatahandler = async () => {
    if (!walletAccount) {
      setStaked(0);
      setEarned(0);
      setClaimed(0);
      return;
    }
    setLoading(true);
    try {
      const _staked = await getDataForStaking(walletAccount, "staked");
      setStaked(_staked);
      const _earned = await getDataForStaking(walletAccount, "earned");
      setEarned(_earned);
      const _claimed = await getDataForStaking(walletAccount, "withdrawn");
      setClaimed(_claimed);
    } catch (error) {
      openSnackbar(<div style={{ maxWidth: 500 }}>
        <p>Error occured. </p>
        <p>{error.message}</p>
      </div>, "error");
      console.error(error);
    }
    setLoading(false);
  }
  useEffect(() => {
    getDatahandler();
    return () => { }
  }, [balance])

  useEffect(() => {
    const getAPY = async () => {
      const _apy = await getDataForStaking(walletAccount, "apy", staked);
      setAPY(_apy);
    }
    getAPY();
  }, [staked])

  useEffect(() => {
    setReward(
      ethers.utils.formatEther(earned) - ethers.utils.formatEther(claimed)
    )
  }, [claimed, earned])

  return (
    <Box
      p={2}
      sx={{
        border: darkMode ? "1px solid rgb(255, 255, 255, 0.5)" : "1px solid rgb(0, 0, 0, 0.3)",
        borderRadius: "10px"
      }}
    >
      {loading ? <h2>Getting data...</h2>
        :
        <>
          <Box display="flex" mb={1} justifyContent="space-between" mt={1}>
            <Typography variant="h4">APY</Typography>
            <Typography>{ethers.utils.formatEther(APY)}
              {balance === 0 && <>(per 100)</>}
            </Typography>
          </Box>
          <Box display="flex" mb={1} justifyContent="space-between" mt={1}>
            <Typography variant="h4">Liquidity</Typography>
            <Typography>746,540.33</Typography>
          </Box>
          <Box display="flex" mb={1} justifyContent="space-between" mt={1}>
            <Typography variant="h4">Staked</Typography>
            <Typography>{ethers.utils.formatEther(staked)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={1} mb={1}>
            <Typography variant="h4">Pending rewards</Typography>
            <Typography>{reward}</Typography>
          </Box>
        </>
      }

    </Box>
  )
}
