// Material
import {
    alpha,
    Box,
    Divider,
    Container,
    styled,
    Toolbar,
    Select,
    MenuItem,
    Link,
    Stack,
    TextField,
    Tooltip,
    Card,
    Typography,
    Button,
    Input,
    IconButton,
    Dialog,
    FormControlLabel,
    Switch,
    DialogActions,
    DialogTitle,
    InputAdornment
} from '@mui/material';
import { AppContext } from 'src/AppContext';
import CloseIcon from '@mui/icons-material/Close';

export function ModalWalletConnect(){
    const { 
        darkMode,
        modalContext,
     } = useContext(AppContext);
     const {
        setWalletaccount,
        showConnectWallet,
        hideModal 
     } = modalContext;
     function handleOpen(){
        showConnectWallet();
     }
    function handleCloseWallet() {
		hideModal();
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
                    {/* <Typography variant='s1'>Setting Slippage</Typography> */}
                    <DialogActions>
                        <Box width="98%" alignItems='center' justifyContent='center' minHeight="280px" minWidth="450px">
                            <Stack width='100%' spacing={1} display='flex' alignItems='center' justifyContent="center">
                                <Button sx={{width:"85%"}}>
                                    <Stack width="100%" display='flex' alignItems='center' justifyContent='space-between' direction='row'>
                                        <Icon>
                                            <img src="static/wallet/meta.png" height="50px" />
                                        </Icon>
                                        <Typography variant='s1'>Metamask</Typography>
                                    </Stack>
                                </Button>
                                <Button sx={{width:"85%"}}>
                                    <Stack width="100%" display='flex' alignItems='center' justifyContent='space-between' direction='row'>
                                        <Icon>
                                            <img src="static/wallet/xverse-wallet.svg" height="50px"/>
                                        </Icon>
                                        <Typography variant='s1'>
                                            Xverse
                                        </Typography>
                                    </Stack>
                                </Button>
                                <Button sx={{width:"85%"}}>
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
    return(
        <div>
            <Button onClick={handleOpen}>
                Connect Wallet        
            </Button>  
            <ModalWallet />
        </div>
    )
}