import Decimal from 'decimal.js';

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

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import Header from 'src/components/Header';
import ScrollToTop from 'src/components/ScrollToTop';
import { useState, useEffect, useRef } from 'react';
import { ethers } from "ethers";
import Web3 from "web3";
import SettingsIcon from '@mui/icons-material/Settings';
import router_abi from 'src/Contracts/router_abi.json'
import token_abi from 'src/Contracts/token_abi.json'
import axios from 'axios'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';

// overflow: scroll;
// overflow: auto;
// overflow: hidden;

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        // overflow: hidden;
        flex: 1;
`
);

const BackgroundWrapper = styled(Box)(
    ({ theme }) => `
        width: 100%;
        height: 90%;
        position: absolute;
        background-size: cover;
        background-color: rgb(32, 34, 37);
        background-position: center center;
        opacity: 0.99;
        z-index: -1;
        filter: blur(8px);
        -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
`
);

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  let DEFAULT_TOKENS = [
    {
        id: 0,
        symbol: 'BTC',
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        decimal: 18,
        description:'Bitcoin',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png'
    },
    {
        id: 1,
        symbol: 'UIBT',
        address: '0x46d84F7A78D3E5017fd33b990a327F8e2E28f30B',
        decimal: 18,
        description:'Unibit token',
        logo: 'static/ubit.png'
    },
    {
        id: 2,
        symbol: 'USDC',
        address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        decimal: 6,
        description:'USD Coin',
        logo: 'static/usdc.png'
    },
    {
        id: 3,
        symbol: 'USDT',
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        decimal: 6,
        description:'Tether Token',
        logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=024'
    },
    {
        id: 4,
        symbol: 'DAI',
        address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        decimal: 18,
        description:'Dai',
        logo: 'static/dai.svg' 
    },
    {
        id: 5,
        symbol: 'WBTC',
        address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        decimal: 8,
        description:'Wrapped BTC',
        logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f/logo.png'
    },
    {
        id: 6,
        symbol: 'ORDI',
        address: 'b61b0172d95e266c18aea0c624db987e971a5d6d4ebc2aaed85da4642d635735i0',
        decimal: 18,
        description:'ORDI',
        logo: 'https://assets-currency.kucoin.com/6478143f4958230001079b56_logo.png'
    },
    {
        id: 7,
        symbol: 'Multibit',
        address: '0x5429706887FCb58a595677B73E9B0441C25d993D',
        decimal: 18,
        description:'MUBI',
        logo: 'https://s2.coinmarketcap.com/static/img/coins/200x200/28412.png'
    },
    {
        id: 8,
        symbol: 'LeverFi',
        address: '0x4B5f49487ea7B3609b1aD05459BE420548789f1f',
        decimal: 18,
        description:'LEVER',
        logo: 'https://pbs.twimg.com/profile_images/1514224753376370695/WI72SpBl_400x400.jpg'
    },
    {
        id: 9,
        symbol: 'RDNT',
        address: '0x0C4681e6C0235179ec3D4F4fc4DF3d14FDD96017',
        decimal: 18,
        description:'Radiant',
        logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x0C4681e6C0235179ec3D4F4fc4DF3d14FDD96017/logo.png'
    },
    {
        id: 10,
        symbol: 'GNS',
        address: '0x18c11FD286C5EC11c3b683Caa813B77f5163A122',
        decimal: 18,
        description:'Gains Network',
        logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x18c11FD286C5EC11c3b683Caa813B77f5163A122/logo.png'
    },
    {
        id: 11,
        symbol: 'DPX',
        address: '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55',
        decimal: 18,
        description:'Dopex Governance Token',
        logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55/logo.png'
    }
];

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

export default function Swap({}) {
    const { darkMode } = useContext(AppContext);
    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />
            <BackgroundWrapper
                style={{
                    backgroundImage: `url(/static/background.png)`,
                    opacity: `${darkMode?0.4:0.6}`
                }}
            />

            <Header />

            <Container maxWidth="lg">
                <Swapping/>
            </Container>

            <ScrollToTop />

        </OverviewWrapper>
    );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in

function Swapping(){
    const { darkMode, openSnackbar, modalContext } = useContext(AppContext);
    const {
        walletaccount,
        showConnectWallet,
     } = modalContext;
    const router_address = "0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30";
    
    const [slippage, setSlippage] = useState(0.5)
    const [autoSlippage, setAutoSlippage] = useState(false)
    
    const ADDR_WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';

    const [tokens, setTokens] = useState(DEFAULT_TOKENS);
    const [select1, setSelect1] = useState(0); // ETH by default
    const [select2, setSelect2] = useState(2); // USDC by default

    const [amount1, setAmount1] = useState(0)
    const [amount2, setAmount2] = useState(0)
    
    const [bal1, setBal1] = useState(0)
    const [bal2, setBal2] = useState(0)

    const [allowance, setAllowance] = useState(0)

    const [open, setOpen] = useState(false);
    const [openSelect1, setOpenSelect1] = useState(false)
    const [openSelect2, setOpenSelect2] = useState(false)

    const [search, setSearch] = useState(null);

    const [swapPrice, setSwapPrice] = useState(0);

    const [importData, setImportData] = useState(null);

    // const checkAllowance = async (address) => {
    //     const { ethereum } = window; 
    //     try{
    //         const accounts = await ethereum.request({ method: "eth_accounts" });
    //         if (accounts.length !== 0) {
    //             const account = accounts[0];

    //             if (address === ADDR_WETH) {
    //                 return 1;
    //             }

    //             const provider = new ethers.providers.Web3Provider(ethereum);
    //             const { chainId } = await provider.getNetwork();
    //             if (chainId != 42161) {
    //                 const switchNetwork = await window.ethereum.request({
    //                     method: "wallet_switchEthereumChain",
    //                     params: [{ chainId: Web3.utils.toHex(42161) }],
    //                 });
    //             }
    //             const signer = provider.getSigner();
    //             const token_contract = new ethers.Contract(address, token_abi, signer);
    //             try {
    //                 const amount = await token_contract.allowance(account, router_address);
    //                 return amount.toString();
    //             } catch(e) {
    //                 console.log(e)
    //             }
    //         } else {
    //             console.log("No aurhorized account found");
    //         }
    //     }catch(e){
    //         console.log('wallet is not connected', e)
    //     }
    //     return 0;
    // };
    const checkBalance = async (address) => {
        const { ethereum } = window;
        try{
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const account = accounts[0];
            const provider = new ethers.providers.Web3Provider(ethereum);
            if (address === ADDR_WETH) {
                let amount = await provider.getBalance(account)
                amount =  ethers.utils.formatEther(amount)
                return amount;
            } else {
                const signer = provider.getSigner();
                const token_contract = new ethers.Contract(address, token_abi, signer);
                try{
                    let amount = (await token_contract.balanceOf(account)).toString();
                    const decimal = await token_contract.decimals();
                    amount = amount/10**decimal;
                    return amount;
                } catch(e){
                    console.log(e)
                    return 0;
                }
            }   
        } catch(e) {
            console.log('Wallet is not connected', e)
        }
        return 0;
    }

    const getPrice = async(name1, name2) => {
        try {
            const price_data = await axios.post(`https://min-api.cryptocompare.com/data/price?fsym=${name1}&tsyms=${name2}`)
            if (price_data) {
                const price = price_data.data[name2];
                console.log(price.toString())
                return price.toString();
            }
        } catch(err){
            console.log("Error on getting price", err)
        }
        return 0;
      }

    const checkPrice = async (amount) => {
        const value = new Decimal(amount || 0).toNumber();
        const token1 = tokens[select1];
        const token2 = tokens[select2];
        const addr1 = token1.address;
        const addr2 = token2.address;
        const name1 = token1.symbol;
        const name2 = token2.symbol;
        if(name1 === 'BLO'){
            name1 = 'USD'
            const price = await getPrice(name1, name2)
            setSwapPrice(price*0.05613)
            setAmount2(price*0.05613*amount)
            return price*0.05613
        } else if (name2 === 'BLO'){
            name2 = 'USD'
            const price = await getPrice(name1, name2)
            setSwapPrice(price/0.05613)
            setAmount2(price/0.05613*amount)
            return price/0.05613
        }
        const price = await getPrice(name1, name2)
        setSwapPrice(price)
        setAmount2(price*amount);
        if (value === 0) {
            setAmount2(0);
            return 0;
        }
        return price
    }

    useEffect(() => {
        const token = tokens[select1];
        const address = token.address;

        // checkAllowance(address).then(amount => {
        //     setAllowance(amount);
        // });

        checkBalance(address).then(amount => {
            setBal1(amount)
        })
    }, [select1]);

    useEffect(() => {
        const token = tokens[select2];
        const address = token.address;

        checkBalance(address).then(amount => {
            setBal2(amount)
        })
    }, [select2])

    useEffect(() => {
        checkPrice(amount1)
    }, [amount1, select1, select2])

    useEffect(() => {
        setTokens(DEFAULT_TOKENS);
    }, [DEFAULT_TOKENS])

    const reverse_swap = () => {
        setSelect1(select2);
        setSelect2(select1);
        setAmount1(amount2);
        setAmount2(amount1);
    }

    // const change_handler = async(e) => {
    //     const value = e.target.value;
    //     setAmount1(value);
    //     await checkPrice(value);
    // }

    const getTokeninfo = async(token) => {
        const { ethereum } = window;
        try{
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const token_contract = new ethers.Contract(token, token_abi, signer);
            try{
                const symbol = await token_contract.symbol();
                const decimal = parseInt(await token_contract.decimals());
                return ([symbol,decimal]);
            } catch(e){
                console.log(e)
                return false;
            }
        } catch(e){
            console.log('Wallet is not connected', e)
        }
    }

    const swapHandler = async() => {
        // const value = new Decimal(amount || 0).toNumber();
        const token1 = tokens[select1];
        const token2 = tokens[select2];
        const addr1 = token1.address;
        const addr2 = token2.address;
        const decimal1 = token1.decimal;
        const decimal2 = token2.decimal;
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const accounts = await ethereum.request({ method: "eth_accounts" });
                const account = accounts[0];
                const router_contract = new ethers.Contract(
                    router_address,
                    router_abi,
                    signer
                );
                const amount_in = (amount1 * 10**decimal1).toString();
                let amount_out = swapPrice * amount1 * 10**decimal2;
                amount_out = Math.round((amount_out * (100 - slippage)/100)).toString();

                console.log(amount_out)

                if (addr1 === ADDR_WETH) {
                    let swap = await router_contract.swapExactNATIVEForTokens(amount_out, [ [15], [2],[addr1, addr2]], account, (Date.now() + 10 * 60),
                    {
                        'value': amount_in
                    });
                    const swap_receipt = await swap.wait()
                    if (swap_receipt && swap_receipt.blockNumber && swap_receipt.status === 1){
                        openSnackbar('Swapping transaction successful', 'success')
                    }
                } else if (addr2 === ADDR_WETH) {
                    let swap = await router_contract.swapExactTokensForNATIVE(amount_in, amount_out, [ [15], [2],[addr1, addr2]], account, (Date.now() + 10 * 60));
                    const swap_receipt = await swap.wait()
                    if (swap_receipt && swap_receipt.blockNumber && swap_receipt.status === 1){
                        openSnackbar('Swapping transaction successful', 'success')
                    }
                } else {
                    let swap = await router_contract.swapExactTokensForTokens(amount1, amount_out, [ [15], [2],[addr1, addr2]], account, (Date.now() + 10 * 60));
                    const swap_receipt = await swap.wait()
                    if (swap_receipt && swap_receipt.blockNumber && swap_receipt.status === 1){
                        openSnackbar('Swapping transaction successful', 'success')
                    }
                }
            } else {
                console.log("Object does not exist");
            }
        } catch(e) {
            if (e.reason === 'insufficient funds for intrinsic transaction cost'){
                openSnackbar('Insufficient funds for intrinsic transaction cost!', 'error')
            } else if (e.reason === 'invalid BigNumber string'){
                openSnackbar('Transaction will be failed, Please increase Slippage', 'error')
            } else if (e.reason === 'missing revert data in call exception'){
                openSnackbar('Token is not approved yet, Please approve token', 'error')
            } else {
                console.log(e);
            }
        }
    }

    const approveHandler = async () =>{
        const token1 = tokens[select1];
        const addr1 = token1.address;

        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const token_contract = new ethers.Contract(
                    addr1,
                    token_abi,
                    signer
                );

                let approve = await token_contract.approve(router_address, '0xffffffffffffffffffffffffffffffffffffff');
                const approve_receipt = await approve.wait();

                if (approve_receipt && approve_receipt.blockNumber && approve_receipt.status === 1){
                    openSnackbar('Approval transaction successful', 'success')
                    // const allow = await checkAllowance();
                    setAllowance(allow);
                }
            } else {
                console.log("Object does not exist");
            }
        }catch(e){
            console.log(e)
            openSnackbar('Approval transaction failed.', 'error')
        }
    }

    const ConnectButton = () =>{
        return(
            <Button fullWidth onClick={showConnectWallet} variant='outlined' sx={{borderRadius: '10px', margin:'20px'}}>
            <h3>Connect Wallet</h3>
            </Button>
        )
    }

    const swapButton = () => {
        return(<>
                {
                allowance < amount1 ?
                    <Button fullWidth onClick={approveHandler} variant='outlined' sx={{borderRadius: '10px', margin:'20px'}}>
                        <h3>Approve</h3>
                    </Button>
                    :
                    <Button fullWidth onClick={swapHandler} variant='outlined' sx={{margin:'20px', borderRadius: '10px'}}>
                        <h3>Exchange</h3>
                    </Button>
                }
                </>
        )
    }

    const settingSlippage = () => {
        return(
            <BootstrapDialog
                open={open}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <Typography variant='h3'>Setting Slippage</Typography>
                </BootstrapDialogTitle>
                <Box alignItems='center'>
                    {/* <Typography variant='s1'>Setting Slippage</Typography> */}
                    <DialogActions>
                        <Box width="98%" alignItems='center' justifyContent='center' minHeight="300px" minWidth="450px">
                            <Stack spacing={1}>
                                <Stack width='100%' display='flex' alignItems='center' justifyContent='space-between' direction='row'>
                                    <Typography variant='s1'>Automatic Slippage Tolerance</Typography>
                                    <FormControlLabel control={<IOSSwitch sx={{ m: 1 }}  checked={autoSlippage} onChange={autoslippageHandler} />} />
                                </Stack>
                                <Stack display='flex' justifyContent='space-between' direction='row'>
                                    <Typography variant='s1'>Slippage</Typography>
                                    <Typography variant='s1' sx={{mr:2}}>{slippage === 100 ? "Auto" : `${slippage}%`}</Typography>
                                </Stack>
                                {slippage === 0.1 &&
                                <Typography color='red'>Your transaction may be reverted due to low slippage tolerance</Typography>}
                                <br/>
                                {
                                    autoSlippage === false &&
                                        <Stack display='flex' spacing={2} direction='row' alignItems='center'>
                                            <Box>
                                                <Button onClick={() => {setSlippage(0.1)}}>0.1%</Button>
                                            </Box>
                                            <Box>
                                                <Button onClick={() => {setSlippage(0.5)}}>0.5%</Button>
                                            </Box>
                                            <Box>
                                                <Button onClick={() => {setSlippage(1)}}>1.0%</Button>
                                            </Box>
                                            <Box>
                                                <Input disableUnderline onChange={(e) => {setSlippage(e.target.value)}} placeholder="Custom"></Input>
                                            </Box>
                                        </Stack>
                                }
                            </Stack>
                        </Box>
                    </DialogActions>
                </Box>
            </BootstrapDialog>
        )
    }

    const autoslippageHandler = (e) => {
        if(e.target.checked){
            setSlippage(100)
            setAutoSlippage(true)
        }
        else{
            setAutoSlippage(false)
        }
    }

    const handleSelect1 = (value) => {
        if (value !== select2) {
            setSelect1(value);
        }
        setOpenSelect1(false);
    }

    const handleSelect2 = (value) => {
        if (value !== select1) {
            setSelect2(value);
        }
        setOpenSelect2(false);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSearch = (e) => {
        const value = e.target.value
        setSearch(value);
        if (/^0x[a-fA-F0-9]{40}$/g.test(value)) {
            console.log('Valid Ethereum address:', value);
            for(let i=0; i<DEFAULT_TOKENS.length; i++){
                if(DEFAULT_TOKENS[i].address === value.toString()){
                    openSnackbar('Already added token', 'error')
                    return false;
                }
            }
            getTokeninfo(value.toString()).then((result)=>{
                if(result){
                    const symbol = result[0];
                    const decimal = result[1];
                    console.log(symbol, decimal)
                    const data = {
                        id: DEFAULT_TOKENS.length,
                        symbol: symbol,
                        address: value.toString(),
                        decimal: decimal,
                        description:'Found by address',
                        logo: 'static/default.svg'
                    }
                    setImportData(data);
                }
            })
          } 
        else {
            if(value!=0)
            openSnackbar('Wrong address! Please input correct Address.','error')
        }
    }

    const importHandler1 = () => {
        DEFAULT_TOKENS.push(importData);
        setSelect1(importData.id);
        setSearch(null);
        setImportData(null);
        setOpenSelect1(false);
    }

    const importHandler2 = () => {
        DEFAULT_TOKENS.push(importData);
        setSelect2(importData.id);
        setSearch(null);
        setImportData(null);
        setOpenSelect2(false);
    }

    return(
    <Box>
        <Stack alignItems='center' justifyContent='center' minHeight='90vh'>
            {/* {message &&
            <Popup/>} */}
            <Box minWidth='38vw' sx={{ borderRadius:'10px', border: '2px solid rgb(255, 255, 255)', padding:'15px 35px', mt:1}}>
                <Stack direction='row' display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant='h3'>Unibit Swap</Typography>
                    <IconButton onClick={handleClickOpen}>
                        <SettingsIcon/>
                    </IconButton>
                    {settingSlippage()}
                </Stack>
                <br />
                <Box>
                    <Box display='flex' alignItems='center' justifyContent='space-between' sx={{background:'#614F1555', borderRadius:'10px', padding:'20px 20px'}}>
                        <Stack>
                            <Button
                                id="token1"
                                value={select1}
                                variant='outlined'
                                onClick={()=>setOpenSelect1(true)}
                                sx={{minWidth: 120, padding:'10px 0px'}}
                            >
                                <Stack direction="row" spacing={0.8} alignItems="center">
                                    <img style={{ height: 23 }} src={DEFAULT_TOKENS[select1].logo} />
                                    <Typography variant="s4">{DEFAULT_TOKENS[select1].symbol}</Typography>
                                    <ArrowDropDownIcon />
                                </Stack>
                            </Button>
                            {openSelect1 && <BootstrapDialog
                            open={openSelect1}
                            onClose={()=>setOpenSelect1(false)}
                            aria-labelledby="Select-title"
                            >
                                <BootstrapDialogTitle id="Select-title" onClose={()=>setOpenSelect1(false)}>
                                    <Typography variant='h3'>Select a Token</Typography>
                                </BootstrapDialogTitle>
                                <Box alignItems="center" sx={{mt:1, mb:2, ml:2, mr:2}}>
                                    <TextField
                                        placeholder='Search Token by address'
                                        fullWidth
                                        value={search}
                                        onChange={handleSearch}
                                        InputProps={{
                                            type: 'search',
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ mr: 0.7 }}>
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end"
                                                // onClick={handleClear}
                                                >
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                                <Box
                                width="450px"
                                alignItems='center'
                                padding='10px'
                                >
                                    { importData ?
                                        <Box justifyContent='space-between' display='flex'>
                                            <Stack direction="row" alignItems="center">
                                                <img style={{ height: 23 }} src={importData.logo} />
                                                <Typography variant="s1" ml={2}>{importData.symbol}</Typography>
                                                <Typography variant="s4" ml={2}>{importData.description}</Typography>
                                            </Stack>
                                            <Button variant='outlined' sx={{":hover":{background:'#1fc7d4'}}} onClick={importHandler1}>Import</Button>
                                        </Box>
                                        :
                                        <>
                                        {tokens.map((row, idx) => (
                                            <MenuItem
                                                key={row.id}
                                                value={row.id}
                                                spacing={2} 
                                                onClick={()=>handleSelect1(row.id)}
                                            >
                                                <Stack direction="row" alignItems="center">
                                                    <img style={{ height: 23 }} src={row.logo} />
                                                    <Typography variant="s1" ml={2}>{row.symbol}</Typography>
                                                    <Typography variant="s4" ml={2}>{row.description}</Typography>
                                                </Stack>
                                            </MenuItem>
                                        ))}
                                        </>
                                    }
                                </Box>
                            </BootstrapDialog>}
                            <Box display='flex' justifyContent='space-between' alignItems='center' sx={{mt:1}}>
                                <Typography>Balance: {Math.round(bal1 * 100000)/100000}</Typography>
                                {bal1 >0 && 
                                <Button variant='outlined' sx={{maxHeight:"25px",color:'black', border: '1px solid rgb(0, 0, 0)', borderRadius: '10px'}} onClick={()=>{setAmount1(bal1)}}>
                                    max
                                </Button>}
                            </Box>
                        </Stack>
                        <Input 
                            display='flex' 
                            onChange={(e) => {setAmount1(e.target.value)}} 
                            value={amount1} 
                            placeholder='0.0'
                            disableUnderline
                            sx={{
                                width: '100%',
                                input: {
                                    autoComplete: 'off',
                                    padding: '10px 0px',
                                    border: 'none',
                                    fontSize: '18px',
                                    textAlign: 'end',
                                    appearance: 'none',
                                    fontWeight: 700,
                                }
                                }}
                        />
                    </Box>
                    <Box textAlign='center' alignItems='center' sx={{m:-1.8}}>
                        <SwapVerticalCircleIcon onClick={()=>{reverse_swap()}} sx={{height:'35px', width:'35px', cursor:'pointer'}} />
                    </Box>
                    <Box display='flex' alignItems='center' justifyContent='space-between' sx={{background:'#614F1555', borderRadius:'10px', padding:'20px 20px'}}>
                        <Stack>
                            <Button
                                id="token2"
                                value={select2}
                                variant='outlined'
                                onClick={() => setOpenSelect2(true)}
                                sx={{minWidth: 120, padding:'10px 0px'}}
                            >
                                <Stack direction="row" spacing={0.8} alignItems="center">
                                    <img style={{ height: 23 }} src={DEFAULT_TOKENS[select2].logo} />
                                    <Typography variant="s4">{DEFAULT_TOKENS[select2].symbol}</Typography>
                                    <ArrowDropDownIcon />
                                </Stack>
                            </Button>
                            {openSelect2 && <BootstrapDialog
                            open={openSelect2}
                            onClose={() => setOpenSelect2(false)}
                            aria-labelledby="Select-title"
                            >
                                <BootstrapDialogTitle id="Select-title" onClose={() => setOpenSelect2(false)}>
                                    <Typography variant='h3'>Select a Token</Typography>
                                </BootstrapDialogTitle>
                                <Box alignItems="center" sx={{mt:1, mb:2, ml:2, mr:2}}>
                                    <TextField
                                        placeholder='Search Token by address'
                                        fullWidth
                                        value={search}
                                        onChange={handleSearch}
                                        InputProps={{
                                            type: 'search',
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ mr: 0.7 }}>
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end"
                                                // onClick={handleClear}
                                                >
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                                <Box
                                sx={{width:{md:"450px"}}}
                                alignItems='center'
                                padding='10px 15px'
                                >
                                    { importData ?
                                        <Box justifyContent='space-between' display='flex'>
                                            <Stack direction="row" alignItems="center">
                                                <img style={{ height: 23 }} src={importData.logo} />
                                                <Typography variant="s1" ml={2}>{importData.symbol}</Typography>
                                                <Typography variant="s4" ml={2}>{importData.description}</Typography>
                                            </Stack>
                                            <Button variant='outlined' sx={{":hover":{background:'#1fc7d4'}}} onClick={importHandler2}>Import</Button>
                                        </Box>
                                        :
                                        <>
                                        {tokens.map((row, idx) => (
                                            <MenuItem
                                                key={row.id}
                                                value={row.id}
                                                spacing={2} 
                                                onClick={()=>handleSelect2(row.id)}
                                            >
                                                <Stack direction="row" alignItems="center">
                                                    <img style={{ height: 23 }} src={row.logo} />
                                                    <Typography variant="s1" ml={2}>{row.symbol}</Typography>
                                                    <Typography variant="s4" ml={2}>{row.description}</Typography>
                                                </Stack>
                                            </MenuItem>
                                        ))}
                                        </>
                                    }
                                </Box>
                            </BootstrapDialog>}
                            <Box display='flex' justifyContent='space-between' alignItems='center' sx={{mt:1}}>
                                <Typography>Balance: {Math.round(bal2 * 100000)/100000}</Typography>
                                {/* {bal2 >0 && 
                                <Button variant='outlined' sx={{maxHeight:"25px",color:'black', border: '1px solid rgb(0, 0, 0)', borderRadius: '10px'}} onClick={()=>{setAmount2(bal2)}}>
                                    max
                                </Button>} */}
                            </Box>
                        </Stack>
                        <Input 
                            display='flex' 
                            onChange={(e)=>{setAmount2(e.target.value)}} 
                            value={amount2} 
                            placeholder='0.0'
                            disableUnderline
                            disabled
                            sx={{
                                width: '100%',
                                input: {
                                    autoComplete: 'off',
                                    padding: '10px 0px',
                                    border: 'none',
                                    fontSize: '18px',
                                    textAlign: 'end',
                                    appearance: 'none',
                                    fontWeight: 700,
                                }
                                }}
                        />
    
                    </Box>
                    <br/>
                    <Box padding='10px'>
                        <Stack display='flex' justifyContent='space-between' direction='row'>
                            <Typography variant='s1'>Slippage</Typography>
                            <Typography variant='s1'>{slippage === 100 ? "Auto" : `${slippage}%`}</Typography>
                        </Stack>
                        <Stack display='flex' justifyContent='space-between' direction='row'>
                            <Typography variant='s1'>Price</Typography>
                            <Typography variant='s1'>{swapPrice} {DEFAULT_TOKENS[select2].symbol} per {DEFAULT_TOKENS[select1].symbol}</Typography>
                        </Stack>
                        <Stack display='flex' justifyContent='space-between' direction='row'>
                            <Typography variant='s1'>fee</Typography>
                            <Typography variant='s1'>0.3%</Typography>
                        </Stack>
                    </Box>
                    <Box display='flex' justifyContent='space-around' alignItems='center' textAlign="center" sx={{mt:1}} width='100%'>
                        {walletaccount ? swapButton() : ConnectButton()}
                    </Box>
                </Box>
            </Box>
        </Stack>
    </Box>
    )
}