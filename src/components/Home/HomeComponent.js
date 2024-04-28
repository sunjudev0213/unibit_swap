import React, { useState, useContext, useEffect } from "react";
// Material
import { Button, Stack, Box, Typography, Input, Dialog } from "@mui/material";
// Context
import { AppContext } from "src/AppContext";
import getConfig from "src/utils/getConfig";
//component
import Page from "src/components/Page";
import WalletConnectButton from "../WalletConnectButton";
// constants
import contractModules from "src/Contracts";
// Utils
import switchNetworkTo from "src/utils/switchNetworkToMetamask";
import { checkBalanceForToken } from "src/utils/checkBalanceHandlers/checkBalanceMetamask";
import { getDataForStaking, stakeUIBT } from "src/utils/stakingHandlers";
import StakingTypeSelect from "../StakingTypeSelect";
import StakingInputNew from "../StakingInputNew";
import StakingWelcomePage from "../StakingWelcomePage";
import errorMessageParser from "src/utils/errorMessageParser";
import StakingPreview from "../StakingPreview";
import StakingRecords from "../StakingRecords";

export default function HomeComponent() {
    const { contractAddresses, contractABIs } = contractModules;
    const { tokenContractAddress } = contractAddresses;
    const { UnibitContractABI } = contractABIs;

    const { openSnackbar, darkMode, walletContext, modalContext, loading, setLoading } = useContext(AppContext);
    const { showConnectWallet } = modalContext;
    const { walletAccount, walletType, WalletTypes } = walletContext;
    const defaultNetwork = getConfig().EVMDefaultNetwork;

    const [balance, setBalance] = useState(0);
    const [walletReady, setWalletReady] = useState(false);
    const [amountin, setAmountin] = useState(0); //stake amount
    const [reload, setReload] = useState(0);
    const [rates, setRates] = useState(null);
    const [rateIndex, setRateIndex] = useState(0); // for staking
    const MULTIPLYER = 1000;
    useEffect(() => {
        const handler = async () => {
            const ready = await checkWalletType();
            setWalletReady(ready);
        };
        handler();
        return () => {};
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
            setLoading(true);
            if (window.ethereum.networkVersion !== defaultNetwork.chainId) {
                await switchNetworkTo(defaultNetwork, openSnackbar, setLoading);
            }
            const _bal = await checkBalanceForToken(tokenContractAddress, UnibitContractABI, walletAccount.address, openSnackbar, setLoading);
            setBalance(_bal);
            await getRates();
            setLoading(false);
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
            await stakeUIBT(amountin.toString(), rateIndex);
        } catch (error) {
            openSnackbar(
                <div style={{ maxWidth: 500 }}>
                    <p>Error occured while staking. </p>
                    <p>{errorMessageParser(error.message)}</p>
                </div>,
                "error"
            );
        }
        setLoading(false);
        setReload(reload + 1);
    };

    const getRates = async () => {
        try {
            const r = await getDataForStaking(walletAccount, "rates");
            setRates([
                { period: "15", rate: r[0] },
                { period: "45", rate: r[1] },
                { period: "90", rate: r[2] },
                { period: "120", rate: r[3] },
                { period: "365", rate: r[4] }
            ]);
        } catch (error) {
            console.log("Error: ", error);
            openSnackbar(
                <div style={{ maxWidth: 500 }}>
                    <p>Error occured while getting rates. </p>
                    <p>{errorMessageParser(error.message)}</p>
                </div>,
                "error"
            );
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
                    <h1>Welcome to Unibit!</h1>
                    <div style={{fontSize: "20px"}}>
                        <p>
                           Unlock the power of cross-chain DeFi innovation with our BRC20 platform: bridge token, create new assets, add liquidity, and launch projects seamlessly across 10 EVM chains!
                        </p>
                    </div>
                </Box>
            </Stack>
        </Page>
    );
}
