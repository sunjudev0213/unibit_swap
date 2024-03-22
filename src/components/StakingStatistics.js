import React, { useState, useContext, useEffect } from "react";
// Material
import { Box, Typography } from "@mui/material";
// Context
import { AppContext } from "src/AppContext";
// Utils
import { getDataForStaking } from "src/utils/staking/getStatistics";

export default function StakingStatistics({ balance }) {
  const { openSnackbar, darkMode, walletContext } = useContext(AppContext);
  const { walletAccount } = walletContext;
  const [APY, setAPY] = useState(0);
  const [staked, setStaked] = useState(0);
  const [claimed, setClaimed] = useState(0);
  const [earned, setEarned] = useState(0);
  const getDatahandler = async() => {
    try {
      const _apy = await getDataForStaking(walletAccount, "apy", balance);
      setAPY(_apy);
      if (!walletAccount) return;
      const _staked = await getDataForStaking(walletAccount, "staked");
      setStaked(_staked);
      const _earned = await getDataForStaking(walletAccount, "earned");
      setEarned(_earned);
      const _claimed = await getDataForStaking(walletAccount, "withdrawn");
      setClaimed(_claimed);
    } catch (error) {
      openSnackbar(error.message, "error");
      console.error(error);
    }
  }
  useEffect(() => {
    getDatahandler();
    return () => {}
  }, [balance])

  return (
    <Box
        p={2}
        sx={{
            border: darkMode ? "1px solid rgb(255, 255, 255, 0.5)" : "1px solid rgb(0, 0, 0, 0.3)",
            borderRadius: "10px"
        }}
    >
        <Box display="flex" mb={1} justifyContent="space-between" mt={1}>
            <Typography variant="h4">APY</Typography>
            <Typography>{APY}</Typography>
        </Box>
        <Box display="flex" mb={1} justifyContent="space-between" mt={1}>
            <Typography variant="h4">Liquidity</Typography>
            <Typography>746,540.33</Typography>
        </Box>
        <Box display="flex" mb={1} justifyContent="space-between" mt={1}>
            <Typography variant="h4">Staked</Typography>
            <Typography>{staked}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={1} mb={1}>
            <Typography variant="h4">Pending rewards</Typography>
            <Typography>{earned - claimed}</Typography>
        </Box>
    </Box>
  )
}
