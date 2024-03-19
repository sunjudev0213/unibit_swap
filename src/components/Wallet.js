import { useRef, useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Web3 from "web3";
// Material
import { alpha, Avatar, Badge, Button, Divider, IconButton, Link, MenuItem, Popover, Stack, Typography, Dialog, DialogActions, DialogTitle, styled, Box } from "@mui/material";
import GridOnIcon from "@mui/icons-material/GridOn";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
// Iconify
import { Icon } from "@iconify/react";
import userLock from "@iconify/icons-fa-solid/user-lock";
// Context
import { useContext } from "react";
import { AppContext } from "src/AppContext";
// Utils
import { getAddress } from "sats-connect";
//styles
import { BootstrapDialog } from "src/utils/styles";
export default function Wallet() {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    let logoImageUrl = null;

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        handleClose();
        setWalletAccount(null);
        setWalletType(WalletTypes.metamask);
    };

    const { modalContext, walletContext, openSnackbar } = useContext(AppContext);
    const { modal, showConnectWallet, hideModal } = modalContext;
    const { walletAccount, setWalletAccount, setWalletType, WalletTypes } = walletContext;
    function handleOpenModal() {
        showConnectWallet();
    }
    function handleCloseWallet() {
        hideModal();
        handleClose();
    }
    async function connectMetamask() {
        const { ethereum } = window;

        if (!ethereum) {
            throw new Error("Metamask is not installed! Go install the extension!");
        }
        // keep track of accounts returned
        let accounts = await ethereum.request({
            method: "eth_requestAccounts"
        });
        handleCloseWallet();
        setWalletAccount(accounts[0]);
        setWalletType(WalletTypes.metamask);
    }

    async function connectXverse() {
        const getAddressOptions = {
            payload: {
                purposes: ["ordinals", "payment"],
                message: "Address for receiving Ordinals",
                network: {
                    type: "Testnet"
                }
            },
            onFinish: (response) => {
                setWalletAccount(response.addresses[0].address);
                setWalletType(WalletTypes.xverse);
                //   setPaymentAddress(response.addresses[1].address);
                //   setOrdinalsPublicKey(response.addresses[0].publicKey);
                //   setPaymentPublicKey(response.addresses[1].publicKey);
                handleCloseWallet();
            },
            onCancel: (e) => {
                console.log(e);
                openSnackbar("Error connecting Xverse Wallet")
            }
        };
        try {
            await getAddress(getAddressOptions);
        } catch (error) {
            console.error("Error while connecting Xverse wallet: ", error);
            openSnackbar(error.message, "error");
        }
    }

    async function connectUnisat() {
        const unisat = window.unisat;

        if (!unisat) {
            openSnackbar("Unisat is not installed! Go install the extension!", "error");
            return;
        }
        try {
            // keep track of accounts returned
            let accounts = await unisat.requestAccounts();
            handleCloseWallet();
            setWalletAccount(accounts[0]);
            setWalletType(WalletTypes.unisat)
        } catch (error) {
            console.error("Error while connecting Unisat wallet: ", error);
            openSnackbar(error.message, "error");
        }

    }

    function BootstrapDialogTitle(props) {
        const { children, onClose, ...other } = props;

        return (
            <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
                {children}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500]
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
        );
    }

    const ModalWallet = () => {
        return (
            <BootstrapDialog open={modal === "wallet"} onClose={modal === "wallet" ? handleCloseWallet : null} aria-labelledby="customized-dialog-title">
                <BootstrapDialogTitle id="customized-dialog-title" onClose={modal === "wallet" ? handleCloseWallet : null}>
                    <Typography variant="h3">Connect Wallet</Typography>
                </BootstrapDialogTitle>
                <Box alignItems="center">
                    <DialogActions>
                        <Box width="98%" alignItems="center" justifyContent="center" minHeight="260px" minWidth="450px">
                            <Stack width="100%" spacing={1} display="flex" alignItems="center" justifyContent="center">
                                <Button sx={{ width: "85%" }} onClick={connectMetamask}>
                                    <Stack width="100%" display="flex" alignItems="center" justifyContent="space-between" direction="row">
                                        <Icon>
                                            <img src="static/wallet/meta.png" height="50px" />
                                        </Icon>
                                        <Typography variant="s1">Metamask</Typography>
                                    </Stack>
                                </Button>
                                <Button sx={{ width: "85%" }} onClick={connectXverse}>
                                    <Stack width="100%" display="flex" alignItems="center" justifyContent="space-between" direction="row">
                                        <Icon>
                                            <img src="static/wallet/xverse-wallet.svg" height="50px" />
                                        </Icon>
                                        <Typography variant="s1">Xverse</Typography>
                                    </Stack>
                                </Button>
                                <Button sx={{ width: "85%" }} onClick={connectUnisat}>
                                    <Stack width="100%" display="flex" alignItems="center" justifyContent="space-between" direction="row">
                                        <Icon>
                                            <img src="static/wallet/unisat-wallet.svg" height="50px" />
                                        </Icon>

                                        <Typography variant="s1">Unisat</Typography>
                                    </Stack>
                                </Button>
                            </Stack>
                        </Box>
                    </DialogActions>
                </Box>
            </BootstrapDialog>
        );
    };

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
            // onMouseOver={handleOpen}
            >
                <Badge color="primary">
                    {logoImageUrl ? <Avatar variant={accountLogo ? "" : "square"} alt="user" src={logoImageUrl} sx={{ width: 32, height: 32 }} /> : <Icon icon={userLock} />}
                </Badge>
            </IconButton>

            <Popover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        ml: 0.5,
                        overflow: "inherit",
                        border: (theme) => `solid 1px ${alpha("#919EAB", 0.08)}`,
                        width: 220
                    }
                }}
            >
                {walletAccount ? (

                    <Stack spacing={1} alignItems="center" sx={{ pt: 1, pb: 2 }}>
                        <Link
                            color="inherit"
                            target="_blank"
                            // href={`https://arbiscan.io/address/${walletaccount}`}
                            rel="noreferrer noopener nofollow"
                        >
                            <Typography align="center" style={{ wordWrap: "break-word" }} variant="body2" sx={{ width: 180, color: "text.secondary" }}>
                                {walletAccount}
                            </Typography>
                        </Link>
                        <Stack direction="row" spacing={1}>
                            <Button variant="contained" onClick={handleLogout} size="small">
                                Logout
                            </Button>
                            <CopyToClipboard text={walletAccount} onCopy={() => { }}>
                                <Button variant="outlined" size="small">
                                    Copy
                                </Button>
                            </CopyToClipboard>
                        </Stack>
                    </Stack>
                ) : (
                    <MenuItem key="wallet" onClick={handleOpenModal} sx={{ typography: "body2", py: 2, px: 2.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="s3" style={{ marginLeft: "10px" }}>
                                Wallet Connect
                            </Typography>
                        </Stack>
                        {/* <ModalWalletConnect /> */}
                    </MenuItem>
                )}
            </Popover>
            <ModalWallet />
        </>
    );
}
