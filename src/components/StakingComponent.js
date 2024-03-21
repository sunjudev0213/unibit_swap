import React, { useState, useContext } from "react";
// Material
import { Container, Stack, Box, Typography } from "@mui/material";
// Context
import { AppContext } from "src/AppContext";
//component
import Page from "src/components/Page";
import WalletConnectButton from "./WalletConnectButton";
import StakingInput from "./StakingInput";

export default function StakingComponent() {
    const { openSnackbar, darkMode, walletContext, modalContext } = useContext(AppContext);
    const { showConnectWallet } = modalContext;
    const { walletAccount } = walletContext;

    const [balance, setBalance] = useState(0);
    const [amountin, setAmountin] = useState(0);
    return (
    <Page title="Create">
        <Stack justifyContent="center" alignItems="center" display="flex" minHeight="80vh">
            <Box maxWidth="md"
                minWidth="35vw"
                sx={{
                    borderRadius: "10px",
                    border: darkMode ? "1px solid rgb(255, 255, 255)" : "1px solid rgb(0, 0, 0, 0.3)",
                    padding: "20px 30px"
                }}>
                    <Typography variant="h3">Unibit Staking</Typography>
                    <Stack justifyContent="center" alignItems="left" display="flex" sx={{ mt: 1}} >
                        <Box display='flex' justifyContent='space-between' textAlign='center' m={1} mt={1}>
                            <Typography variant='h4'>Select amount</Typography>
                            <Typography>balance: {Math.round(balance * 10000000000)/10000000000}</Typography>
                        </Box>
                        <StakingInput amountin={amountin} setAmountin={setAmountin} balance={balance} />
                        <Box display='flex' mb={1} justifyContent='space-between' mt={1}>
                            <Typography variant='h4'>APY</Typography>
                            <Typography>299%</Typography>
                        </Box>
                        <Box display='flex' mb={1} justifyContent='space-between' mt={1}>
                            <Typography variant='h4'>Liquidity</Typography>
                            <Typography>746,540.33</Typography>
                        </Box>
                        <Box display='flex' mb={1} justifyContent='space-between' mt={1}>
                            <Typography variant='h4'>Staked</Typography>
                            <Typography>{balance}</Typography>
                        </Box>
                        <Box display='flex' justifyContent='space-between' mt={1} mb={1}>
                            <Typography variant='h4'>Pending rewards</Typography>
                            <Typography>{balance}</Typography>
                        </Box>                    
                    </Stack>
                    <Stack justifyContent="center" alignItems="center" display="flex" >
                    {
                        !walletAccount 
                        ?
                        <WalletConnectButton showConnectWallet={showConnectWallet} />
                        :
                        <div></div>
                    }
                    </Stack>                    
            </Box>
        </Stack>
    </Page>
    );
}
