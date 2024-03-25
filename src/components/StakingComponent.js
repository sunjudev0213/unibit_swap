import React, { useState, useContext, useEffect } from "react";
// Material
import { Button, Stack, Box, Typography, Input, Dialog } from "@mui/material";
// Context
import { AppContext } from "src/AppContext";
import getConfig from "src/utils/getConfig";
//component
import Page from "src/components/Page";
import WalletConnectButton from "./WalletConnectButton";
import StakingInput from "./StakingInput";
import StakingStatistics from "./StakingStatistics";
// constants
import contractModules from "src/Contracts";
// Utils
import switchNetworkTo from "src/utils/switchNetworkToMetamask";
import { checkBalanceForToken } from "src/utils/checkBalanceHandlers/checkBalanceMetamask";
import { claimReward, isOwner, setAPR, stakeUIBT, unStake } from "src/utils/stakingHandlers";
import { ethers } from "ethers";
import { DialerSip } from "@mui/icons-material";
import ManualAPRDialog from "./ManualAPRDialog";

export default function StakingComponent() {
    const { contractAddresses, contractABIs } = contractModules;
    const { tokenContractAddress } = contractAddresses;
    const { UnibitContractABI } = contractABIs;

    const { openSnackbar, darkMode, walletContext, modalContext, loading, setLoading } = useContext(AppContext);
    const { showConnectWallet } = modalContext;
    const { walletAccount, walletType, WalletTypes } = walletContext;
    const defaultNetwork = getConfig().EVMDefaultNetwork;

    const [balance, setBalance] = useState(0);
    const [waleltReady, setWalletReady] = useState(false);
    const [amountin, setAmountin] = useState(0);
    const [reward, setReward] = useState(0);
    const [staked, setStaked] = useState(0);
    const [amountOut, setAmountOut] = useState(0);
    const [reload, setReload] = useState(0);
    const [manualAPR, setManualAPR] = useState(0);
    const [aprOpen, setAPROpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        const handler = async () => {
            const ready = await checkWalletType();
            setWalletReady(ready);
        }
        handler();
        return () => { };
    }, [walletType, reload]);

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
            await checkAdmin();
            return true;
        }

        setBalance(0);
        return false;
    };

    const stakeHandler = async () => {
        if (amountin < 100) {
            openSnackbar("Should stake at least 100 UIBT", "warning");
            return;
        } else if (amountin > balance) {
            openSnackbar("Can't stake more than you have.", "warning");
            return;
        } else if (balance === 0) {
            openSnackbar("Not enough balance to stake.", "warning");
            return;
        }
        setLoading(true);
        try {
            await stakeUIBT(amountin.toString());
        } catch (error) {
            openSnackbar(<div style={{ maxWidth: 500 }}>
                <p>Error occured while staking. </p>
                <p>{error.message}</p>
            </div>, "error");
        }
        setLoading(false);
        setReload(reload + 1);
    };
    const claimHandler = async () => {
        setLoading(true);
        try {
            await claimReward();
        } catch (error) {
            openSnackbar(<div style={{ maxWidth: 500 }}>
                <p>Error occured while staking. </p>
                <p>{error.message}</p>
            </div>, "error");
        }
        setLoading(false);
        setReload(reload + 1);
    };

    const unStakeHandler = async () => {
        if (amountOut > (staked / 1e18)) {
            openSnackbar("Can not withdraw more than you staked.", "warning");
            return;
        }
        setLoading(true);
        try {
            await unStake(amountOut.toString());
        } catch (error) {
            openSnackbar(<div style={{ maxWidth: 500 }}>
                <p>Error occured while staking. </p>
                <p>{error.message}</p>
            </div>, "error");
        }
        setLoading(false);
        setReload(reload + 1);
    }

    const setAPRHandler = async() => {
        setLoading(true);
        try {
            await setAPR(manualAPR * 100 );
        } catch (error) {
            openSnackbar(<div style={{ maxWidth: 500 }}>
                <p>Error occured while setting APR. </p>
                <p>{error.message}</p>
            </div>, "error");
            console.log(error)
        }
        setReload(reload + 1);
        setLoading(false);
    }

    const checkAdmin = async() => {
        try {
            const res = await isOwner();
            setIsAdmin(res);
            console.log(res);
        } catch (error) { 
            openSnackbar(<div style={{ maxWidth: 500 }}>
            <p>Error occured while checking admin. </p>
            <p>{error.message}</p>
        </div>, "error");            
        }
    }

    

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
                    <div style={{ display: "flex", justifyContent: "space-between"}}>
                    <Typography variant="h3">Unibit Staking</Typography>
                    {isAdmin && <div style={{ alignItems: "center"}}>
                        
                        <Button variant="outlined" onClick={() => setAPROpen(true)}>Set APR</Button>
                        <ManualAPRDialog open={aprOpen} setOpen={setAPROpen} manualAPR={manualAPR} setManualAPR={setManualAPR} onOK={setAPRHandler}/>
                    </div>}
                    </div>
                    
                    
                    <Stack justifyContent="center" alignItems="left" display="flex" sx={{ mt: 1 }}>
                        <Box display="flex" justifyContent="space-between" textAlign="center" m={1} mt={1}>
                            <Typography variant="h4">Select amount</Typography>
                            <Typography>Balance: {balance}</Typography>
                        </Box>
                        <StakingInput amountin={amountin} setAmountin={setAmountin} balance={balance} />
                        {waleltReady && <StakingStatistics balance={balance} reward={reward} setReward={setReward} staked={staked} setStaked={setStaked} reload={reload}/>}
                    </Stack>
                    <Stack justifyContent="center" alignItems="center" display="flex">
                        {!walletAccount ? (
                            <WalletConnectButton showConnectWallet={showConnectWallet} />
                        ) : (
                            loading ?
                                <h3>Please wait...</h3>
                                :
                                <>
                                {staked > 0 &&  <Box display="flex" width={"100%"} height={50} mt={1} gap={1}>
                                        <Input
                                            fullWidth
                                            placeholder="0.0"
                                            value={amountOut}
                                            onChange={(e) => {
                                                setAmountOut(e.target.value);
                                            }}
                                            disableUnderline
                                            sx={{
                                                width: "100%",
                                                input: {
                                                    padding: "15px 15px",
                                                    fontSize: "12px",
                                                    textAlign: "start",
                                                    appearance: "none",
                                                    border: "solid 1px",
                                                    borderRadius: 1,
                                                    fontWeight: 700
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={unStakeHandler}
                                        >
                                            Unstake
                                        </Button>
                                    </Box>}
                                    <Box display="flex" width={"100%"} height={50} mt={1} justifyContent="space-around">

                                        <Button
                                            variant="outlined"
                                            onClick={stakeHandler}
                                        >
                                            <h3>Stake UIBT</h3>
                                        </Button>
                                        <Button
                                            disabled={reward > 0 ? false : true}
                                            variant="outlined"
                                            onClick={() => {
                                                claimHandler();
                                            }}
                                        >
                                            <h3>Claim Reward</h3>
                                        </Button>
                                    </Box>
                                </>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </Page>
    );
}
