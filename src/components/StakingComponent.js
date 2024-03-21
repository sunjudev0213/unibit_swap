import React, { useState, useContext, useEffect } from "react";
// Material
import { Button, Stack, Box, Typography } from "@mui/material";
// Context
import { AppContext } from "src/AppContext";
//component
import Page from "src/components/Page";
import WalletConnectButton from "./WalletConnectButton";
import StakingInput from "./StakingInput";
// constants
import { UNIBIT, staking_contract_address } from "src/utils/constants";
import UNIBIT_ABI from "src/Contracts/token_abi.json"
// Utils
import approveHandlerMetamask from "src/utils/approveHandlers/approveHandlerMetamask";

export default function StakingComponent() {
    const { openSnackbar, darkMode, walletContext, modalContext, setLoading } = useContext(AppContext);
    const { showConnectWallet } = modalContext;
    const { walletAccount, walletType, WalletTypes } = walletContext;

    const [balance, setBalance] = useState(0);
    const [reward, setReward] = useState(0);
    const [amountin, setAmountin] = useState(0);
    useEffect(() => {
        checkWalletType();
        return () => { }
    }, [walletType])

    const checkWalletType = () => {
        if (walletType === WalletTypes.xverse || walletType === WalletTypes.unisat) {
            openSnackbar(<div>Staking is only supported for Arbitrum network for now. 
                <br />
                Please connect EVM chain to stake.
                </div>, 
                "warning"
            );
            return false;
        }
        return true;
    }

    

    const stakeHandler = async() => {
        openSnackbar("Still under development", "warning");
    }
    const claimHandler = async() => {
        openSnackbar("Still under development", "warning");
    }
    const stakeOrClaim = async (mode) => {
        if (!checkWalletType()) return;
        setLoading(true);
        openSnackbar("Staking");
        approveHandlerMetamask(
            UNIBIT,
            UNIBIT_ABI,
            staking_contract_address,
            openSnackbar,
            mode === "stake" ? stakeHandler : claimHandler,
            setLoading
        )
    }
    
    return (
        <Page title="Create">
            <Stack justifyContent="center" alignItems="center" display="flex" minHeight="80vh">
                <Box maxWidth="lg"
                    minWidth="35vw"
                    px={6}
                    py={5}
                    sx={{
                        borderRadius: "10px",
                        border: darkMode ? "1px solid rgb(255, 255, 255)" : "1px solid rgb(0, 0, 0, 0.3)",
                        
                    }}>
                    <Typography variant="h3">Unibit Staking</Typography>
                    <Stack justifyContent="center" alignItems="left" display="flex" sx={{ mt: 1 }} >
                        <Box p={2} sx={{
                            border: darkMode ? "1px solid rgb(255, 255, 255, 0.5)" : "1px solid rgb(0, 0, 0, 0.3)",
                            borderRadius: "10px",
                        }}>
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
                        </Box>

                        <Box display='flex' justifyContent='space-between' textAlign='center' m={1} mt={1}>
                            <Typography variant='h4'>Select amount</Typography>
                            <Typography>Balance: {Math.round(balance * 10000000000) / 10000000000}</Typography>
                        </Box>
                        <StakingInput amountin={amountin} setAmountin={setAmountin} balance={balance} />
                    </Stack>
                    <Stack justifyContent="center" alignItems="center" display="flex" >
                        {
                            !walletAccount
                                ?
                                <WalletConnectButton showConnectWallet={showConnectWallet} />
                                :
                                <Box display='flex' width={"100%"} height={50} justifyContent='space-around' >
                                    <Button 
                                        variant='outlined' 
                                        onClick={() => {stakeOrClaim("stake")}}>
                                        <h3>Stake UIBT</h3>
                                    </Button>
                                    <Button 
                                        disabled={reward > 0 ? false : true} 
                                        variant='outlined' 
                                        onClick={() => {stakeOrClaim("claim")}}>
                                        <h3>Claim Reward</h3>
                                    </Button>
                                </Box>
                        }
                    </Stack>
                </Box>
            </Stack>
        </Page>
    );
}
