import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import {
    alpha,
    Avatar,
    Badge,
    Button,
    Divider,
    IconButton,
    Link,
    MenuItem,
    Popover,
    Stack,
    Typography,
    Dialog,
    DialogActions,
    DialogTitle,
    styled,
    Box
} from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import Web3 from "web3";
import CloseIcon from '@mui/icons-material/Close';
// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Iconify
import { Icon } from '@iconify/react';
import userLock from '@iconify/icons-fa-solid/user-lock';
import { getAddress } from "sats-connect";
// Utils

// Components

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
        setWalletaccount(null);
    }

    const { 
        darkMode,
        modalContext,
     } = useContext(AppContext);
     const {
        modal,
        walletaccount,
        setWalletaccount,
        showConnectWallet,
        hideModal 
     } = modalContext;
     function handleOpenModal(){
        showConnectWallet();
     }
    function handleCloseWallet() {
		hideModal();
        handleClose();
	}
    async function connectMetamask(){
        const { ethereum } = window;
		// keep track of accounts returned
		let accounts = [];
		if (!ethereum) {
			throw new Error("Metamask is not installed! Go install the extension!");
		}
		
		accounts = await ethereum.request({
			method: 'eth_requestAccounts',
		});
		handleCloseWallet();
		setWalletaccount(accounts[0]);
    }

    async function connectXverse(){
        const getAddressOptions = {
            payload: {
              purposes: ["ordinals", "payment"],
              message: "Address for receiving Ordinals",
              network: {
                type: "Testnet",
              },
            },
            onFinish: (response) => {
                setWalletaccount(response.addresses[0].address);
            //   setPaymentAddress(response.addresses[1].address);
            //   setOrdinalsPublicKey(response.addresses[0].publicKey);
            //   setPaymentPublicKey(response.addresses[1].publicKey);
              handleCloseWallet();
            },
            onCancel: (e) => {
                console.log(e)
            },
          };
        await getAddress(getAddressOptions);
    }

    async function connectUnisat(){
        const unisat = window.unisat;
		// keep track of accounts returned
		let accounts = [];
		if (!unisat) {
			throw new Error("Unisat is not installed! Go install the extension!");
		}
		
		accounts = await unisat.requestAccounts();
		handleCloseWallet();
		setWalletaccount(accounts[0]);
    }

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
          padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
          padding: theme.spacing(1),
        },
      }));
    
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
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            ) : null}
          </DialogTitle>
        );
      }

    const ModalWallet = () => {
        return(
            <BootstrapDialog
                open={modal === "wallet"}
                onClose={modal === "wallet" ? handleCloseWallet : null}
                aria-labelledby="customized-dialog-title"
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={modal === "wallet" ? handleCloseWallet : null}>
                    <Typography variant='h3'>Connect Wallet</Typography>
                </BootstrapDialogTitle>
                <Box alignItems='center'>
                    <DialogActions>
                        <Box width="98%" alignItems='center' justifyContent='center' minHeight="260px" minWidth="450px">
                            <Stack width='100%' spacing={1} display='flex' alignItems='center' justifyContent="center">
                                <Button sx={{width:"85%"}} onClick={connectMetamask}>
                                    <Stack width="100%" display='flex' alignItems='center' justifyContent='space-between' direction='row'>
                                        <Icon>
                                            <img src="static/wallet/meta.png" height="50px" />
                                        </Icon>
                                        <Typography variant='s1'>Metamask</Typography>
                                    </Stack>
                                </Button>
                                <Button sx={{width:"85%"}} onClick={connectXverse}>
                                    <Stack width="100%" display='flex' alignItems='center' justifyContent='space-between' direction='row'>
                                        <Icon>
                                            <img src="static/wallet/xverse-wallet.svg" height="50px"/>
                                        </Icon>
                                        <Typography variant='s1'>
                                            Xverse
                                        </Typography>
                                    </Stack>
                                </Button>
                                <Button sx={{width:"85%"}} onClick={connectUnisat}>
                                    <Stack width="100%" display='flex' alignItems='center' justifyContent='space-between' direction='row'>
                                        <Icon>
                                            <img src="static/wallet/unisat-wallet.svg" height="50px" />   
                                        </Icon>

                                        <Typography variant='s1'>
                                            Unisat
                                        </Typography>
                                    </Stack>
                                </Button>
                                
                            </Stack>
                        </Box>
                    </DialogActions>
                </Box>
            </BootstrapDialog>
        )
    }

    return (
        <>

            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                // onMouseOver={handleOpen}
            >
                <Badge color="primary">
                    {logoImageUrl?(
                        <Avatar
                            variant={accountLogo?"":"square"}
                            alt="user" src={logoImageUrl}
                            sx={{ width: 32, height: 32 }}
                        />
                    ):(
                        <Icon icon={userLock}/>
                    )}
                </Badge>
            </IconButton>

            <Popover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        ml: 0.5,
                        overflow: 'inherit',
                        border: (theme) => `solid 1px ${alpha('#919EAB', 0.08)}`,
                        width: 220,
                    }
                }}
            >
                {walletaccount ? (
                        <>
                            <Link
                                underline="none"
                                color="inherit"
                                // target="_blank"
                                href={`/`}
                                rel="noreferrer noopener nofollow"
                            >
                                <MenuItem
                                    key="unibit-swap"
                                    sx={{ typography: 'body2', py: 2, px: 2.5 }}
                                    onClick={()=>setOpen(false)}
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <Badge color="primary">
                                            <CurrencyExchangeIcon />
                                        </Badge>
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Swap</Typography>
                                    </Stack>
                                </MenuItem>
                            </Link>
                            <Link
                                underline="none"
                                color="inherit"
                                // target="_blank"
                                href="/pool"
                                rel="noreferrer noopener nofollow"
                            >
                                <MenuItem
                                    key="liquidity"
                                    sx={{ typography: 'body2', py: 2, px: 2.5 }}
                                    onClick={()=>setOpen(false)}
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <GridOnIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Add Liquidity</Typography>
                                    </Stack>
                                </MenuItem>
                            </Link>
                            <Link
                                underline="none"
                                color="inherit"
                                // target="_blank"
                                href="/create"
                                rel="noreferrer noopener nofollow"
                            >
                                <MenuItem
                                    key="token-launch"
                                    sx={{ typography: 'body2', py: 2, px: 2.5 }}
                                    onClick={()=>setOpen(false)}
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <RocketLaunchIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Token Launch</Typography>
                                    </Stack>
                                </MenuItem>
                            </Link>
                            <Link
                                underline="none"
                                color="inherit"
                                href={`/setting`}
                                rel="noreferrer noopener nofollow"
                            >
                                <MenuItem
                                    key="settings"
                                    sx={{ typography: 'body2', py: 2, px: 2.5 }}
                                    onClick={()=>setOpen(false)}
                                >
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <SettingsIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Settings</Typography>
                                    </Stack>
                                </MenuItem>
                            </Link>
                            <Divider />
                            <Stack spacing={1} alignItems='center' sx={{pt: 1, pb: 2}}>
                                <Link
                                    color="inherit"
                                    target="_blank"
                                    // href={`https://arbiscan.io/address/${walletaccount}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Typography align="center" style={{ wordWrap: "break-word" }} variant="body2" sx={{ width: 180, color: 'text.secondary' }} >
                                        {walletaccount}
                                    </Typography>
                                </Link>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="contained" onClick={handleLogout} size="small">
                                        Logout
                                    </Button>
                                    <CopyToClipboard text={walletaccount} onCopy={()=>{}}>
                                        <Button variant="outlined" size="small">
                                            Copy
                                        </Button>
                                    </CopyToClipboard>
                                </Stack>
                            </Stack>
                        </>
                    ) : (
                        <MenuItem
                            key="wallet"
                            onClick={handleOpenModal}
                            sx={{ typography: 'body2', py: 2, px: 2.5 }}
                        >
                            <Stack direction='row' spacing={1} alignItems='center'>
                                <Typography variant='s3' style={{marginLeft: '10px'}}>Wallet Connect</Typography>
                            </Stack>
                            {/* <ModalWalletConnect /> */}
                        </MenuItem>
                )}
            </Popover>
            <ModalWallet />
        </>
    );
}
