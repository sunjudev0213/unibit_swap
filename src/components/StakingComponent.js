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
import contractModules from "src/Contracts";
// Utils
import approveHandlerMetamask from "src/utils/approveHandlers/approveHandlerMetamask";
import getConfig from "src/utils/getConfig";
import switchNetworkTo from "src/utils/switchNetworkToMetamask";
import { checkBalanceForToken } from "src/utils/checkBalanceHandlers/checkBalanceMetamask";
import StakingStatistics from "./StakingStatistics";
import { stakeUIBT } from "src/utils/stakingHandlers";

export default function StakingComponent() {
    const { contractAddresses, contractABIs} = contractModules;
    const { tokenContractAddress, stakingContractAddress } = contractAddresses;
    const { UnibitContractABI } = contractABIs;

    const { openSnackbar, darkMode, walletContext, modalContext, setLoading } = useContext(AppContext);
    const { showConnectWallet } = modalContext;
    const { walletAccount, walletType, WalletTypes } = walletContext;
    const defaultNetwork = getConfig().EVMDefaultNetwork;

    const [balance, setBalance] = useState(0);
    const [reward, setReward] = useState(0);
    const [amountin, setAmountin] = useState(0);
    useEffect(() => {
        checkWalletType();
        return () => {};
    }, [walletType]);

    const checkWalletType = async () => {
        if (walletType === WalletTypes.xverse || walletType === WalletTypes.unisat) {
            openSnackbar(
                <div>
                    Staking is only supported for Arbitrum network for now.
                    <br />
                    Please connect EVM chain to stake.
                </div>,
                "warning"
            );
        } else if (walletType === WalletTypes.metamask) {
            if (window.ethereum.networkVersion !== defaultNetwork.chainId) {
                setLoading(true);
                await switchNetworkTo(defaultNetwork, openSnackbar, setLoading);
            }
            const _bal = await checkBalanceForToken(tokenContractAddress, UnibitContractABI, walletAccount.address, openSnackbar, setLoading);
            setBalance(_bal);
            return true;
        }
        
        setBalance(0);
        return false;
    };

    const stakeHandler = async () => {
        if (amountin < 100) {
            openSnackbar("Should stake at least 100 UIBT", "warning");
            setLoading(false);
            return;
        } else if (amountin > balance) {
            openSnackbar("Can't stake more than you have.", "warning");
            setLoading(false);
            return;
        } else if (balance === 0) {
            openSnackbar("Not enough balance to stake.", "warning");
            setLoading(false);
            return;
        }
        try {
            await stakeUIBT(amountin.toString());
        } catch (error) {
            openSnackbar(<div style={{ maxWidth: 500 }}>
                <p>Error occured while staking. </p>
                <p>{error.message}</p>
            </div>, "error");
        }
        setLoading(false);
    };
    const claimHandler = async () => {
        try {
            
        } catch (error) {
            openSnackbar(<div style={{ maxWidth: 500 }}>
                <p>Error occured while staking. </p>
                <p>{error.message}</p>
            </div>, "error");
        }
        setLoading(false);
    };
    const stakeOrClaim = async (mode) => {
        if (!checkWalletType()) return;  
        setLoading(true);      
        if (mode === "stake") {
            stakeHandler();
        } else {
            claimHandler();
        }
    };

    return (
        <Page title="Create">
            <Stack justifyContent="center" alignItems="center" display="flex" minHeight="80vh">
                <Box
                    maxWidth="lg"
                    minWidth="35vw"
                    px={4}
                    py={2}
                    sx={{
                        borderRadius: "10px",
                        border: darkMode ? "1px solid rgb(255, 255, 255)" : "1px solid rgb(0, 0, 0, 0.3)"
                    }}
                >
                    <Typography variant="h3">Unibit Staking</Typography>
                    <Stack justifyContent="center" alignItems="left" display="flex" sx={{ mt: 1 }}>
                        <Box display="flex" justifyContent="space-between" textAlign="center" m={1} mt={1}>
                            <Typography variant="h4">Select amount</Typography>
                            <Typography>Balance: {balance}</Typography>
                        </Box>
                        <StakingInput amountin={amountin} setAmountin={setAmountin} balance={balance} />
                        <StakingStatistics balance={balance} reward={reward} setReward={setReward}/>
                    </Stack>
                    <Stack justifyContent="center" alignItems="center" display="flex">
                        {!walletAccount ? (
                            <WalletConnectButton showConnectWallet={showConnectWallet} />
                        ) : (
                            <Box display="flex" width={"100%"} height={50} mt={1} justifyContent="space-around">
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        stakeOrClaim("stake");
                                    }}
                                >
                                    <h3>Stake UIBT</h3>
                                </Button>
                                <Button
                                    disabled={reward > 0 ? false : true}
                                    variant="outlined"
                                    onClick={() => {
                                        stakeOrClaim("claim");
                                    }}
                                >
                                    <h3>Claim Reward</h3>
                                </Button>
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </Page>
    );
}
