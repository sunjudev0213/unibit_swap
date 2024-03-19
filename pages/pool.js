// import axios from 'axios'
// import { performance } from 'perf_hooks';
// import dynamic from 'next/dynamic';

// Material
import {
  Box,
  Container,
  styled,
  Toolbar,
  Button,
  Select,
  Typography,
  MenuItem,
  Stack,
  TextField,
  Input,
  Grid,
  Dialog,
  DialogActions,
  DialogTitle,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Switch
} from '@mui/material';

import axios from 'axios';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import Header from 'src/components/Header';
import ScrollToTop from 'src/components/ScrollToTop';
import { useState, useEffect } from 'react';
import token_abi from 'src/Contracts/token_abi.json';
import { ethers } from 'ethers';
import Web3 from 'web3';
import router_abi from 'src/Contracts/router_abi.json';
import factory_abi from 'src/Contracts/factory_abi.json';

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

let DEFAULT_TOKENS = [
  {
    id: 0,
    symbol: 'BTC',
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    decimal: 18,
    description: 'Bitcoin',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png'
  },
  {
    id: 1,
    symbol: 'UIBT',
    address: '0x46d84F7A78D3E5017fd33b990a327F8e2E28f30B',
    decimal: 18,
    description: 'Unibit token',
    logo: 'static/ubit.png'
  },
  {
    id: 2,
    symbol: 'USDC',
    address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    decimal: 6,
    description: 'USD Coin',
    logo: 'static/usdc.png'
  },
  {
    id: 3,
    symbol: 'USDT',
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    decimal: 6,
    description: 'Tether Token',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=024'
  },
  {
    id: 4,
    symbol: 'DAI',
    address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    decimal: 18,
    description: 'Dai',
    logo: 'static/dai.svg'
  },
  {
    id: 5,
    symbol: 'WBTC',
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    decimal: 8,
    description: 'Wrapped BTC',
    logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f/logo.png'
  },
  {
    id: 6,
    symbol: 'ORDI',
    address:
      'b61b0172d95e266c18aea0c624db987e971a5d6d4ebc2aaed85da4642d635735i0',
    decimal: 18,
    description: 'ORDI',
    logo: 'https://assets-currency.kucoin.com/6478143f4958230001079b56_logo.png'
  },
  {
    id: 7,
    symbol: 'Multibit',
    address: '0x5429706887FCb58a595677B73E9B0441C25d993D',
    decimal: 18,
    description: 'MUBI',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/200x200/28412.png'
  },
  {
    id: 8,
    symbol: 'LeverFi',
    address: '0x4B5f49487ea7B3609b1aD05459BE420548789f1f',
    decimal: 18,
    description: 'LEVER',
    logo: 'https://pbs.twimg.com/profile_images/1514224753376370695/WI72SpBl_400x400.jpg'
  },
  {
    id: 9,
    symbol: 'RDNT',
    address: '0x0C4681e6C0235179ec3D4F4fc4DF3d14FDD96017',
    decimal: 18,
    description: 'Radiant',
    logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x0C4681e6C0235179ec3D4F4fc4DF3d14FDD96017/logo.png'
  },
  {
    id: 10,
    symbol: 'GNS',
    address: '0x18c11FD286C5EC11c3b683Caa813B77f5163A122',
    decimal: 18,
    description: 'Gains Network',
    logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x18c11FD286C5EC11c3b683Caa813B77f5163A122/logo.png'
  },
  {
    id: 11,
    symbol: 'DPX',
    address: '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55',
    decimal: 18,
    description: 'Dopex Governance Token',
    logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55/logo.png'
  }
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
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
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function Pool({}) {
  const { darkMode, openSnackbar } = useContext(AppContext);

  return (
    <OverviewWrapper>
      <Toolbar id="back-to-top-anchor" />

      <BackgroundWrapper
        style={{
          backgroundImage: `url(/static/background.png)`,
          opacity: `${darkMode ? 0.4 : 0.6}`
        }}
      />

      <Header />

      <Container maxWidth="lg">
        <L_pool />
      </Container>

      <ScrollToTop />
    </OverviewWrapper>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export function L_pool() {
  const { darkMode, openSnackbar, modalContext } = useContext(AppContext);
  const { walletaccount, showConnectWallet } = modalContext;
  const router_address = '0x28a1676bcC9b479B49E3c0C6b56e280563D8E47f';
  const factory_address = '0x1F78A1891383E35BCF89108f40Ae3229372cdC58';
  const WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
  const UNIBIT = '0x46d84F7A78D3E5017fd33b990a327F8e2E28f30B';
  const USDC = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8';
  const USDT = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
  const EU_pair = '0x787Ec456d93dc5046167626184a3FD8161ce944A';
  const EB_pair = '0x5327cc11527c29a9b90754E3D5eF9dd76027ca3D';
  const [token1, setToken1] = useState(WETH);
  const [token2, setToken2] = useState(USDC);

  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const [select1, setSelect1] = useState(0); // ETH by default
  const [select2, setSelect2] = useState(2); // USDC by default
  const [openSelect1, setOpenSelect1] = useState(false);
  const [openSelect2, setOpenSelect2] = useState(false);
  const [search, setSearch] = useState(null);
  const [importData, setImportData] = useState(null);
  const [add_click, setAdd_click] = useState(false);
  const [setting_click, setSetting_click] = useState(false);
  const [amount1, setAmount1] = useState(0);
  const [amount2, setAmount2] = useState(0);
  const [remove_amount, setRemove_amount] = useState(0);
  const [bal1, setBal1] = useState(0);
  const [bal2, setBal2] = useState(0);
  const [allowance1, setAllowance1] = useState(0);
  const [allowance2, setAllowance2] = useState(0);
  const [enable, setEnable] = useState(false);
  const [pair, setPair] = useState(null);
  const [liquidity_bal, setLiquidity_bal] = useState(null);
  const [liquidity_bal1, setLiquidity_bal1] = useState(null);
  const [liquidity_bal2, setLiquidity_bal2] = useState(null);
  const [liquidity_status, setLiquidity_status] = useState(true);
  const [fromNetwork, setFromNetwork] = useState('bitcoin');
  const [toNetwork, setToNetwork] = useState('ethereum');

  const [decimal1, setDecimal1] = useState(18);
  const [decimal2, setDecimal2] = useState(18);

  const handleSelect1 = (value) => {
    if (value !== select2) {
      setSelect1(value);
    }
    setOpenSelect1(false);
  };

  const handleSelect2 = (value) => {
    if (value !== select1) {
      setSelect2(value);
    }
    setOpenSelect2(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (/^0x[a-fA-F0-9]{40}$/g.test(value)) {
      console.log('Valid Ethereum address:', value);
      for (let i = 0; i < DEFAULT_TOKENS.length; i++) {
        if (DEFAULT_TOKENS[i].address === value.toString()) {
          openSnackbar('Already added token', 'error');
          return false;
        }
      }
      getTokeninfo(value.toString()).then((result) => {
        if (result) {
          const symbol = result[0];
          const decimal = result[1];
          console.log(symbol, decimal);
          const data = {
            id: DEFAULT_TOKENS.length,
            symbol: symbol,
            address: value.toString(),
            decimal: decimal,
            description: 'Found by address',
            logo: 'static/default.svg'
          };
          setImportData(data);
        }
      });
    } else {
      if (value != 0)
        openSnackbar('Wrong address! Please input correct Address.', 'error');
    }
  };

  const importHandler1 = () => {
    DEFAULT_TOKENS.push(importData);
    setSelect1(importData.id);
    setSearch(null);
    setImportData(null);
    setOpenSelect1(false);
  };

  const importHandler2 = () => {
    DEFAULT_TOKENS.push(importData);
    setSelect2(importData.id);
    setSearch(null);
    setImportData(null);
    setOpenSelect2(false);
  };

  useEffect(() => {
    checkBalance(EU_pair).then((amount) => {
      setLiquidity_bal1(amount);
    });
    checkBalance(EB_pair).then((amount) => {
      setLiquidity_bal2(amount);
    });
  }, [add_click]);

  useEffect(() => {
    checkBalance(token1).then((amount) => {
      setBal1(amount);
    });
    checkAllowance(token1).then((amount) => {
      //   setAllowance1(amount)
    });
    if (token1 === WETH) {
      setDecimal1(18);
    }
  }, [token1, setting_click, enable]);

  useEffect(() => {
    checkBalance(token2).then((amount) => {
      setBal2(amount);
    });
    checkAllowance(token2).then((amount) => {
      //   setAllowance2(amount)
    });
    if (token2 === WETH) {
      setDecimal2(18);
    }
  }, [token2, setting_click, enable]);

  useEffect(() => {
    checkPrice();
  }, [amount1, amount2, token1, token2]);

  useEffect(() => {
    checkPair().then(() => {
      checkBalance(pair).then((amount) => {
        setLiquidity_bal(amount);
      });
    });
  }, [liquidity_status]);

  const checkBalance = async (token) => {
    const { ethereum } = window;
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const account = accounts[0];
      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId != 42161) {
        const switchNetwork = await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Web3.utils.toHex(42161) }]
        });
      }
      if (token === WETH) {
        let amountETH = await provider.getBalance(account);
        amountETH = ethers.utils.formatEther(amountETH);
        return amountETH;
      } else {
        const signer = provider.getSigner();
        const token_contract = new ethers.Contract(token, token_abi, signer);
        try {
          let amount = (await token_contract.balanceOf(account)).toString();
          const decimal = await token_contract.decimals();
          if (token === token1) {
            setDecimal1(decimal.toString());
          } else if (token === token2) {
            setDecimal2(decimal.toString());
          }
          if (token === EU_pair || token === EB_pair) {
            return Web3.utils.fromWei(amount);
          }
          amount = amount / 10 ** decimal;
          return amount;
        } catch (e) {
          console.log(e);
          return 0;
        }
      }
    } catch (e) {
      console.log('Wallet is not connected', e);
      return 0;
    }
  };

  const checkPair = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      try {
        const factory_contract = new ethers.Contract(
          factory_address,
          factory_abi,
          signer
        );
        setPair(await factory_contract.getPair(token1, token2));
      } catch (e) {
        console.log('pair is not exist', e);
      }
    } else {
      console.log('No aurhorized account found');
    }
  };

  const checkAllowance = async (token) => {
    const { ethereum } = window;
    if (token === WETH) {
      return 1;
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        const account = accounts[0];
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const token_contract = new ethers.Contract(token, token_abi, signer);
        try {
          const amount = (
            await token_contract.allowance(account, router_address)
          ).toString();
          console.log(amount);
          return amount;
        } catch (e) {
          console.log(e);
          return 0;
        }
      } else {
        console.log('No aurhorized account found');
      }
    } catch (e) {
      console.log('wallet is not connected', e);
      return 0;
    }
  };

  const approveHandler = async (token) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const token_contract = new ethers.Contract(token, token_abi, signer);
        let approve = await token_contract.approve(
          router_address,
          '0xffffffffffffffffffffffffffffffffffffff'
        );
        const approve_receipt = await approve.wait();
        if (
          approve_receipt &&
          approve_receipt.blockNumber &&
          approve_receipt.status === 1
        ) {
          setEnable(!enable);
          openSnackbar('Token Approoval transaction successful', 'success');
          const allowance = await checkAllowance(token);
          if (token === token1_address) {
            // setAllowance1(allowance)
          } else {
            // setAllowance2(allowance);
          }
        }
      } else {
        console.log('Object does not exist');
      }
    } catch (e) {
      console.log(e);
      openSnackbar('Approval transaction failed', 'error');
    }
  };

  const getPrice = async (name1, name2) => {
    try {
      const price_data = await axios.post(
        `https://min-api.cryptocompare.com/data/price?fsym=${name1}&tsyms=${name2}`
      );
      if (price_data) {
        const price = price_data.data[name2];
        console.log(price.toString());
        return price.toString();
      }
    } catch (err) {
      console.log('Error on getting price', err);
    }
    return 0;
  };

  const checkPrice = async () => {
    let [name1, name2] = [];
    if (token1 === WETH) {
      name1 = 'ETH';
    }
    if (token1 === USDC) {
      name1 = 'USDC';
    }
    if (token1 === USDT) {
      name1 = 'USDT';
    }
    if (token1 === UNIBIT) {
      name1 = 'USD';
    }
    if (token2 === WETH) {
      name2 = 'ETH';
    }
    if (token2 === USDC) {
      name2 = 'USDC';
    }
    if (token2 === USDT) {
      name2 = 'USDT';
    }
    if (token2 === UNIBIT) {
      name2 = 'USD';
    }
    getPrice(name1, name2).then((value) => {
      console.log(value);
      if (token1 === UNIBIT) {
        setAmount2((amount1 * 0.05613) / value);
      } else if (token2 === UNIBIT) {
        setAmount2((amount1 * value) / 0.05613);
      } else {
        setAmount2(amount1 * value);
      }
    });
    // setAmount1(amount2/price)
  };

  //   const change_handler = async(value) =>{
  //     setAmount1(value);
  //     await checkPrice(value);
  //   }

  const SupplyHandler = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const account = accounts[0];
        const router_contract = new ethers.Contract(
          router_address,
          router_abi,
          signer
        );
        const amount_in = (amount1 * 10 ** decimal1).toString();
        const amount_out = (amount2 * 10 ** decimal2).toString();
        if (token1 === WETH) {
          let swap = await router_contract.addLiquidityETH(
            token2,
            amount_out,
            0,
            0,
            account,
            Date.now() + 10 * 60,
            {
              value: amount_in
            }
          );
          const swap_receipt = await swap.wait();
          if (
            swap_receipt &&
            swap_receipt.blockNumber &&
            swap_receipt.status === 1
          ) {
            openSnackbar('Add Liquidity transaction successful', 'success');
          }
        } else if (token2 === WETH) {
          let swap = await router_contract.addLiquidityETH(
            token1,
            amount_in,
            0,
            0,
            account,
            Date.now() + 10 * 60,
            {
              value: amount_out
            }
          );
          const swap_receipt = await swap.wait();
          if (
            swap_receipt &&
            swap_receipt.blockNumber &&
            swap_receipt.status === 1
          ) {
            openSnackbar('Add Liquidity transaction successful', 'success');
          }
        } else {
          let swap = await router_contract.addLiquidity(
            token1,
            token2,
            amount_in,
            amount_out,
            0,
            0,
            account,
            Date.now() + 10 * 60
          );
          const swap_receipt = await swap.wait();
          if (
            swap_receipt &&
            swap_receipt.blockNumber &&
            swap_receipt.status === 1
          ) {
            openSnackbar('Add Liquidity transaction successful', 'success');
          }
        }
        setAdd_click(false);
        setSetting_click(false);
      } else {
        console.log('Object does not exist');
      }
    } catch (e) {
      if (e.reason === 'insufficient funds for intrinsic transaction cost') {
        openSnackbar(
          'Insufficient funds for intrinsic transaction cost!',
          'error'
        );
      } else if (e.reason === 'invalid BigNumber string') {
        openSnackbar('Invalid amount, Please decrease amount!', 'error');
      } else if (e.reason === 'overflow') {
        openSnackbar('Overflow! Please decrease amount.', 'error');
      } else if (e.reason === 'user rejected transaction') {
        openSnackbar(
          'Metamask Tx Signature, User denied transaction signature',
          'error'
        );
      }
      console.log(e.reason);
    }
  };

  const withdrawHandler = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const account = accounts[0];
        const router_contract = new ethers.Contract(
          router_address,
          router_abi,
          signer
        );
        const amount_in = Web3.utils.toWei(remove_amount);
        if (token1 === WETH && token2 === WETH) {
          let remove = await router_contract.removeLiquidityETH(
            pair,
            amount_in,
            0,
            0,
            account,
            Date.now() + 10 * 60
          );
          const remove_receipt = await remove.wait();
          if (
            remove_receipt &&
            remove_receipt.blockNumber &&
            remove_receipt.status === 1
          ) {
            openSnackbar('Add Liquidity transaction successful', 'success');
          }
        } else {
          let remove = await router_contract.removeLiquidity(
            token1,
            token2,
            amount_in,
            0,
            0,
            account,
            Date.now() + 10 * 60
          );
          const remove_receipt = await remove.wait();
          if (
            remove_receipt &&
            remove_receipt.blockNumber &&
            remove_receipt.status === 1
          ) {
            openSnackbar('Add Liquidity transaction successful', 'success');
          }
        }
        setAdd_click(false);
        setSetting_click(false);
      } else {
        console.log('Object does not exist');
      }
    } catch (e) {
      openSnackbar('Withdrawal transaction failed', 'error');
      console.log(e);
    }
  };

  const addHandler = (addr1, addr2) => {
    setAdd_click(true);
    setSetting_click(true);
    setToken1(addr1);
    setToken2(addr2);
    setLiquidity_status(true);
  };

  const removeHandler = (addr1, addr2) => {
    setAdd_click(true);
    setSetting_click(true);
    setToken1(addr1);
    setToken2(addr2);
    setLiquidity_status(false);
  };

  const SetliquidityPool = () => {
    return (
      <Box sx={{ padding: '5px 20px' }}>
        <Typography variant="h3">Setting Liquidity</Typography>
        <br />
        <Button
          onClick={() => {
            setLiquidity_status(true);
          }}
        >
          Add Liquidity
        </Button>
        <Button
          onClick={() => {
            setLiquidity_status(false);
          }}
        >
          Remove Liquidity
        </Button>
        {liquidity_status ? (
          <Box mt={2}>
            <Stack
              display="flex"
              alignItems="center"
              direction="column"
              justifyContent="space-between"
              sx={{
                background: '#614F1555',
                borderRadius: '10px',
                padding: '20px 20px'
              }}
            >
              <Stack
                justifyContent="space-between"
                direction="row"
                display="flex"
                width="100%"
              >
                <Button
                  id="token1"
                  value={select1}
                  variant="outlined"
                  onClick={() => setOpenSelect1(true)}
                  sx={{ minWidth: 120, maxWidth: 140, padding: '10px 0px' }}
                >
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <img
                      style={{ height: 23 }}
                      src={DEFAULT_TOKENS[select1].logo}
                    />
                    <Typography variant="s4">
                      {DEFAULT_TOKENS[select1].symbol}
                    </Typography>
                    <ArrowDropDownIcon />
                  </Stack>
                </Button>
                {openSelect1 && (
                  <BootstrapDialog
                    open={openSelect1}
                    onClose={() => setOpenSelect1(false)}
                    aria-labelledby="Select-title"
                  >
                    <BootstrapDialogTitle
                      id="Select-title"
                      onClose={() => setOpenSelect1(false)}
                    >
                      <Typography variant="h3">Select a Token</Typography>
                    </BootstrapDialogTitle>
                    <Box
                      alignItems="center"
                      sx={{ mt: 1, mb: 2, ml: 2, mr: 2 }}
                    >
                      <TextField
                        placeholder="Search Token by address"
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
                            <InputAdornment
                              position="end"
                              // onClick={handleClear}
                            ></InputAdornment>
                          )
                        }}
                      />
                    </Box>
                    <Box width="450px" alignItems="center" padding="10px">
                      {importData ? (
                        <Box justifyContent="space-between" display="flex">
                          <Stack direction="row" alignItems="center">
                            <img style={{ height: 23 }} src={importData.logo} />
                            <Typography variant="s1" ml={2}>
                              {importData.symbol}
                            </Typography>
                            <Typography variant="s4" ml={2}>
                              {importData.description}
                            </Typography>
                          </Stack>
                          <Button
                            variant="outlined"
                            sx={{ ':hover': { background: '#1fc7d4' } }}
                            onClick={importHandler1}
                          >
                            Import
                          </Button>
                        </Box>
                      ) : (
                        <>
                          {tokens.map((row, idx) => (
                            <MenuItem
                              key={row.id}
                              value={row.id}
                              spacing={2}
                              onClick={() => handleSelect1(row.id)}
                            >
                              <Stack direction="row" alignItems="center">
                                <img style={{ height: 23 }} src={row.logo} />
                                <Typography variant="s1" ml={2}>
                                  {row.symbol}
                                </Typography>
                                <Typography variant="s4" ml={2}>
                                  {row.description}
                                </Typography>
                              </Stack>
                            </MenuItem>
                          ))}
                        </>
                      )}
                    </Box>
                  </BootstrapDialog>
                )}
                <Select
                  id="network1"
                  value={fromNetwork}
                  onChange={(e) => {
                    setFromNetwork(e.target.value);
                  }}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="bitcoin">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img
                        style={{ height: 23 }}
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
                      />
                      <Typography variant="s3">Bitcoin</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="ethereum">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img
                        style={{ height: 23 }}
                        src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029"
                      />
                      <Typography variant="s3">Ethereum</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="bsc">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img
                        style={{ height: 23 }}
                        src="https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=029"
                      />
                      <Typography variant="s3">BSC</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="arbitrum">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img
                        style={{ height: 23 }}
                        src="https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=029"
                      />
                      <Typography variant="s3">Arbitrum</Typography>
                    </Stack>
                  </MenuItem>
                </Select>
              </Stack>
              <Stack
                justifyContent="space-between"
                direction="row"
                display="flex"
                width="100%"
              >
                <Input
                  display="flex"
                  onChange={(e) => {
                    setAmount1(e.target.value);
                  }}
                  value={amount1}
                  placeholder="0.0"
                  disableUnderline
                  sx={{
                    input: {
                      autoComplete: 'off',
                      padding: '10px 0px',
                      border: 'none',
                      fontSize: '18px',
                      textAlign: 'start',
                      appearance: 'none',
                      fontWeight: 700
                    }
                  }}
                />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 1 }}
                >
                  <Typography>
                    Balance: {Math.round(bal1 * 100000) / 100000}
                  </Typography>
                  {bal1 > 0 && (
                    <Button
                      variant="outlined"
                      sx={{
                        maxHeight: '25px',
                        color: 'black',
                        border: '1px solid rgb(0, 0, 0)',
                        borderRadius: '10px'
                      }}
                      onClick={() => {
                        setAmount1(bal1);
                      }}
                    >
                      max
                    </Button>
                  )}
                </Box>
              </Stack>
            </Stack>
            <Stack
              direction="column"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                background: '#614F1555',
                borderRadius: '10px',
                padding: '20px 20px',
                mt: 1
              }}
            >
              <Stack
                justifyContent="space-between"
                direction="row"
                display="flex"
                width="100%"
              >
                <Button
                  id="token2"
                  value={select2}
                  variant="outlined"
                  onClick={() => setOpenSelect2(true)}
                  sx={{ minWidth: 120, padding: '10px 0px' }}
                >
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <img
                      style={{ height: 23 }}
                      src={DEFAULT_TOKENS[select2].logo}
                    />
                    <Typography variant="s4">
                      {DEFAULT_TOKENS[select2].symbol}
                    </Typography>
                    <ArrowDropDownIcon />
                  </Stack>
                </Button>
                {openSelect2 && (
                  <BootstrapDialog
                    open={openSelect2}
                    onClose={() => setOpenSelect2(false)}
                    aria-labelledby="Select-title"
                  >
                    <BootstrapDialogTitle
                      id="Select-title"
                      onClose={() => setOpenSelect2(false)}
                    >
                      <Typography variant="h3">Select a Token</Typography>
                    </BootstrapDialogTitle>
                    <Box
                      alignItems="center"
                      sx={{ mt: 1, mb: 2, ml: 2, mr: 2 }}
                    >
                      <TextField
                        placeholder="Search Token by address"
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
                            <InputAdornment
                              position="end"
                              // onClick={handleClear}
                            ></InputAdornment>
                          )
                        }}
                      />
                    </Box>
                    <Box
                      sx={{ width: { md: '450px' } }}
                      alignItems="center"
                      padding="10px 15px"
                    >
                      {importData ? (
                        <Box justifyContent="space-between" display="flex">
                          <Stack direction="row" alignItems="center">
                            <img style={{ height: 23 }} src={importData.logo} />
                            <Typography variant="s1" ml={2}>
                              {importData.symbol}
                            </Typography>
                            <Typography variant="s4" ml={2}>
                              {importData.description}
                            </Typography>
                          </Stack>
                          <Button
                            variant="outlined"
                            sx={{ ':hover': { background: '#1fc7d4' } }}
                            onClick={importHandler2}
                          >
                            Import
                          </Button>
                        </Box>
                      ) : (
                        <>
                          {tokens.map((row, idx) => (
                            <MenuItem
                              key={row.id}
                              value={row.id}
                              spacing={2}
                              onClick={() => handleSelect2(row.id)}
                            >
                              <Stack direction="row" alignItems="center">
                                <img style={{ height: 23 }} src={row.logo} />
                                <Typography variant="s1" ml={2}>
                                  {row.symbol}
                                </Typography>
                                <Typography variant="s4" ml={2}>
                                  {row.description}
                                </Typography>
                              </Stack>
                            </MenuItem>
                          ))}
                        </>
                      )}
                    </Box>
                  </BootstrapDialog>
                )}
                <Select
                  id="network2"
                  value={toNetwork}
                  onChange={(e) => {
                    setToNetwork(e.target.value);
                  }}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="bitcoin">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img
                        style={{ height: 23 }}
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
                      />
                      <Typography variant="s3">Bitcoin</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="ethereum">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img
                        style={{ height: 23 }}
                        src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029"
                      />
                      <Typography variant="s3">Ethereum</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="bsc">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img
                        style={{ height: 23 }}
                        src="https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=029"
                      />
                      <Typography variant="s3">BSC</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="arbitrum">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img
                        style={{ height: 23 }}
                        src="https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=029"
                      />
                      <Typography variant="s3">Arbitrum</Typography>
                    </Stack>
                  </MenuItem>
                </Select>
              </Stack>
              <Stack
                justifyContent="space-between"
                direction="row"
                display="flex"
                width="100%"
              >
                <Input
                  display="flex"
                  onChange={(e) => {
                    setAmount2(e.target.value);
                  }}
                  value={amount2}
                  placeholder="0.0"
                  disableUnderline
                  sx={{
                    input: {
                      autoComplete: 'off',
                      padding: '10px 0px',
                      border: 'none',
                      fontSize: '18px',
                      textAlign: 'start',
                      appearance: 'none',
                      fontWeight: 700
                    }
                  }}
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 1 }}
                >
                  <Typography>
                    Balance: {Math.round(bal2 * 100000) / 100000}
                  </Typography>
                  {bal2 > 0 && (
                    <Button
                      variant="outlined"
                      sx={{
                        maxHeight: '25px',
                        color: 'black',
                        border: '1px solid rgb(0, 0, 0)',
                        borderRadius: '10px'
                      }}
                      onClick={() => {
                        setAmount2(bal2);
                      }}
                    >
                      max
                    </Button>
                  )}
                </Box>
              </Stack>
            </Stack>
            <br />
            <Stack display="flex" alignItems="center" textAlign="center">
              <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                textAlign="center"
                sx={{ mt: 1 }}
                width="100%"
              >
                {allowance1 <= 0 && walletaccount && (
                  <Button
                    style={{
                      color: 'black',
                      background: '#F8D20F',
                      padding: '10px 30px'
                    }}
                    onClick={() => {
                      approveHandler(token1);
                    }}
                  >
                    Enable Token1
                  </Button>
                )}
                {allowance2 <= 0 && walletaccount && (
                  <Button
                    style={{
                      color: 'black',
                      background: '#F8D20F',
                      padding: '10px 30px'
                    }}
                    onClick={() => {
                      approveHandler(token2);
                    }}
                  >
                    Enable Token2
                  </Button>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                sx={{ mt: 2 }}
                width="75%"
              >
                {!walletaccount ? (
                  <Button
                    fullWidth
                    sx={{
                      color: 'black',
                      background: '#F8D20F',
                      padding: '10px 30px'
                    }}
                    onClick={showConnectWallet}
                  >
                    Connect Wallet
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    sx={{
                      color: 'black',
                      background: '#F8D20F',
                      padding: '10px 30px'
                    }}
                    onClick={() => {
                      SupplyHandler();
                    }}
                  >
                    Supply
                  </Button>
                )}
              </Box>
            </Stack>
          </Box>
        ) : (
          <Box>
            <Stack>
              <Box
                display="flex"
                justifyContent="space-between"
                textAlign="center"
                m={1}
              >
                <Typography variant="h4">Select amount</Typography>
                <Typography>
                  balance:{' '}
                  {Math.round(liquidity_bal * 10000000000) / 10000000000}
                </Typography>
              </Box>
              <Box
                sx={{
                  background: '#beb494',
                  maxWidth: '100%',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <img
                  src="logo/logo.png"
                  style={{ height: '30px', marginLeft: '3px' }}
                ></img>
                <Input
                  fullWidth
                  placeholder="0.0"
                  id="amount"
                  value={remove_amount}
                  onChange={(e) => {
                    setRemove_amount(e.target.value);
                  }}
                  disableUnderline
                  sx={{
                    width: '100%',
                    input: {
                      padding: '15px 15px',
                      border: 'none',
                      fontSize: '18px',
                      textAlign: 'start',
                      appearance: 'none',
                      color: 'black',
                      fontWeight: 700
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  sx={{
                    maxHeight: '25px',
                    color: 'black',
                    border: '1px solid rgb(0, 0, 0)',
                    borderRadius: '10px',
                    mr: 1
                  }}
                  onClick={() => {
                    setRemove_amount(liquidity_bal);
                  }}
                >
                  max
                </Button>
              </Box>
            </Stack>
            <br />
            <Box display="flex" mb={1} justifyContent="space-between">
              <Typography variant="h4">Liquidity</Typography>
              <Typography>746,540.33</Typography>
            </Box>
            {
              <Button
                fullWidth
                variant="outlined"
                sx={{ background: 'rgb(165, 168, 190)' }}
                onClick={() => {
                  approveHandler(pair);
                }}
              >
                <h4>Enable</h4>
              </Button>
            }
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                withdrawHandler();
              }}
              sx={{ background: 'rgb(165, 168, 190)', mt: 2 }}
            >
              <h4>Withdraw</h4>
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  const Addliquidity = () => {
    return (
      <Box>
        <SetliquidityPool />
        {/* {setting_click ?
            :
                <Box>
                <Typography variant='h3'>CHOOSE YOUR VALID PAIR</Typography>
                <Stack display='flex' direction='row' justifyContent='space-around' alignItems='center' sx={{mt:5}}>
                    <div>
                    <Select
                        id="token1"
                        value={token1}
                        onChange={(e) => {if(e.target.value !== token2)setToken1(e.target.value);}}
                        sx={{minWidth: 120}}
                        >
                        <MenuItem value={WETH}>
                            <img style={{ height: 18, marginRight: 5 }} src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg" />
                            ETH
                        </MenuItem>
                        <MenuItem value={UNIBIT}>
                            <img style={{ height: 15, marginRight: 5 }} src="logo/logo.png" />
                            UNIBIT
                        </MenuItem>
                        <MenuItem value={USDC}>
                            <img style={{ height: 15, marginRight: 5 }} src="static/usdc.png" />
                            USDC
                        </MenuItem>
                        <MenuItem value={USDT}>
                            <img style={{ height: 15, marginRight: 5 }} src="https://cryptologos.cc/logos/tether-usdt-logo.png?v=024" />
                            USDT
                        </MenuItem>
                    </Select>
                    <Typography mt={1}>Balance: {Math.round(bal1 * 100000)/100000}</Typography>
                    </div>
                    <p>+</p>
                    <div>
                    <Select
                        id="token1"
                        value={token2}
                        onChange={(e) => {if(e.target.value !== token1)setToken2(e.target.value);}}
                        sx={{minWidth: 120}}
                        >
                        <MenuItem value={WETH}>
                            <img style={{ height: 18, marginRight: 5 }} src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg" />
                            ETH
                        </MenuItem>
                        <MenuItem value={UNIBIT}>
                            <img style={{ height: 15, marginRight: 5 }} src="logo/logo.png" />
                            UNIBIT
                        </MenuItem>
                        <MenuItem value={USDC}>
                            <img style={{ height: 15, marginRight: 5 }} src="static/usdc.png" />
                            USDC
                        </MenuItem>
                        <MenuItem value={USDT}>
                            <img style={{ height: 15, marginRight: 5 }} src="https://cryptologos.cc/logos/tether-usdt-logo.png?v=024" />
                            USDT
                        </MenuItem>
                    </Select>
                    <Typography mt={1}>Balance: {Math.round(bal2 * 100000)/100000}</Typography>
                    </div>
                </Stack>

                <div style={{alignItems:'center', textAlign:"center", marginTop:'50px'}}>
                    <Button style={{color: "black", background:"#F8D20F", padding:"10px 30px"}} onClick={()=>{setSetting_click(true)}}>Next</Button>
                </div>
                </Box>
            } */}
      </Box>
    );
  };
  return (
    <Box>
      {add_click && (
        <Stack>
          <Button
            onClick={() => {
              setAdd_click(false);
              setSetting_click(false);
            }}
            sx={{ mt: 1, width: '20px' }}
          >
            back
          </Button>
        </Stack>
      )}
      <Stack
        justifyContent="center"
        alignItems="center"
        display="flex"
        minHeight="80vh"
      >
        <Box
          minWidth="35vw"
          sx={{
            borderRadius: '10px',
            border: '2px solid rgb(255, 255, 255)',
            padding: '20px 30px'
          }}
        >
          {add_click ? (
            Addliquidity()
          ) : (
            <Stack alignItems="center" display="flex">
              <Typography variant="h3">Your Pool List: </Typography>
              <br />
              <Stack minWidth="70vw" textAlign="center">
                {liquidity_bal1 > 0 || liquidity_bal2 > 0 ? (
                  <Box>
                    {liquidity_bal1 > 0 && (
                      <Grid
                        container
                        display="flex"
                        alignItems="center"
                        sx={{
                          padding: '20px 20px',
                          borderBottom: '1px solid rgb(175, 175, 175)'
                        }}
                      >
                        <Grid item xs={12} md={3}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            display="flex"
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                              textAlign="center"
                              sx={{ mr: 1 }}
                            >
                              <img
                                style={{ height: 30 }}
                                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg"
                              />
                              <img
                                style={{ height: 30 }}
                                src="static/usdc.png"
                              />
                            </Box>
                            <h3>WETH-USDC</h3>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            display="flex"
                            justifyContent="space-around"
                          >
                            <p>Staking</p>
                            <p>
                              {Math.round(liquidity_bal1 * 10000000000) /
                                10000000000}
                            </p>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            display="flex"
                            justifyContent="space-around"
                          >
                            <p>APR</p>
                            <p>750 %</p>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            display="flex"
                            justifyContent="space-around"
                          >
                            <Button
                              variant="outlined"
                              onClick={() => {
                                addHandler(WETH, USDC);
                              }}
                            >
                              + ADD
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                removeHandler(WETH, USDC);
                              }}
                            >
                              - REMOVE
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    )}
                    {liquidity_bal2 > 0 && (
                      <Grid
                        container
                        display="flex"
                        alignItems="center"
                        sx={{
                          padding: '20px 20px',
                          borderBottom: '1px solid rgb(175, 175, 175)'
                        }}
                      >
                        <Grid item xs={12} md={3}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            display="flex"
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                              textAlign="center"
                              sx={{ mr: 1 }}
                            >
                              <img
                                style={{ height: 30 }}
                                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg"
                              />
                              <img style={{ height: 30 }} src="logo/logo.png" />
                            </Box>
                            <h3>WETH-UNIBIT</h3>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            display="flex"
                            justifyContent="space-around"
                          >
                            <p>Staking</p>
                            <p>
                              {Math.round(liquidity_bal2 * 10000000000) /
                                10000000000}
                            </p>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            display="flex"
                            justifyContent="space-around"
                          >
                            <p>APR</p>
                            <p>750 %</p>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            display="flex"
                            justifyContent="space-around"
                          >
                            <Button
                              variant="outlined"
                              onClick={() => {
                                addHandler(WETH, UNIBIT);
                              }}
                            >
                              + ADD
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                removeHandler(WETH, UNIBIT);
                              }}
                            >
                              - REMOVE
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                ) : (
                  <Typography variant="h4">No liquidity Found</Typography>
                )}
              </Stack>
              <br />
              <Button
                sx={{
                  color: 'black',
                  background: '#F8D20F',
                  padding: '20px 30px',
                  margin: '10px'
                }}
                onClick={() => {
                  setAdd_click(!add_click);
                }}
              >
                + Add Liquidity
              </Button>
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
