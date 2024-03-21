import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Decimal from "decimal.js";
// Material
import { Box, MenuItem, Stack, TextField, Typography, Button, Input, InputAdornment } from "@mui/material";

import SwapVerticalCircleIcon from "@mui/icons-material/SwapVerticalCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
// abi
import router_abi from "src/Contracts/router_abi.json";
import token_abi from "src/Contracts/token_abi.json";
// components
import BootstrapDialogTitle from "src/components/common/BootstrapDialogTitle";
import SwapConnectButton from "src/components/SwapConnectButton";
import SwapButton from "./SwapButton";
import SwapSetting from "./SwapSetting";
// context
import { AppContext } from "src/AppContext";
// utils
import { DEFAULT_TOKENS } from "src/utils/tokenList";
import { ADDR_WETH, router_address } from "src/utils/constants";
import getPrice from "src/utils/swapping/getPrice";
import getTokeninfo from "src/utils/swapping/getTokeninfo";
// styles
import { BootstrapDialog } from "src/utils/styles";

export default function Swapping() {
    const { openSnackbar, modalContext, walletContext, darkMode } = useContext(AppContext);
    const { showConnectWallet } = modalContext;
    const { walletAccount } = walletContext;
    const [slippage, setSlippage] = useState(0.5);

    const [tokens, setTokens] = useState(DEFAULT_TOKENS);
    const [select1, setSelect1] = useState(0); // ETH by default
    const [select2, setSelect2] = useState(2); // USDC by default

    const [amount1, setAmount1] = useState(0);
    const [amount2, setAmount2] = useState(0);

    const [bal1, setBal1] = useState(0);
    const [bal2, setBal2] = useState(0);

    const [allowance, setAllowance] = useState(0);

    const [openSelect1, setOpenSelect1] = useState(false);
    const [openSelect2, setOpenSelect2] = useState(false);

    const [search, setSearch] = useState(null);

    const [swapPrice, setSwapPrice] = useState(0);

    const [importData, setImportData] = useState(null);

    const checkBalance = async (address) => {
        const { ethereum } = window;
        try {
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const account = accounts[0];
            const provider = new ethers.providers.Web3Provider(ethereum);
            if (address === ADDR_WETH) {
                let amount = await provider.getBalance(account);
                amount = ethers.utils.formatEther(amount);
                return amount;
            } else {
                const signer = provider.getSigner();
                const token_contract = new ethers.Contract(address, token_abi, signer);
                try {
                    let amount = (await token_contract.balanceOf(account)).toString();
                    const decimal = await token_contract.decimals();
                    amount = amount / 10 ** decimal;
                    return amount;
                } catch (e) {
                    console.log(e);
                    openS;
                    return 0;
                }
            }
        } catch (e) {
            console.log("Wallet is not connected", e);
        }
        return 0;
    };

    const checkPrice = async (amount) => {
        const value = new Decimal(amount || 0).toNumber();
        const token1 = tokens[select1];
        const token2 = tokens[select2];
        const addr1 = token1.address;
        const addr2 = token2.address;
        let name1 = token1.symbol;
        let name2 = token2.symbol;
        if (name1 === "BLO") {
            name1 = "USD";
            const price = await getPrice(name1, name2);
            setSwapPrice(price * 0.05613);
            setAmount2(price * 0.05613 * amount);
            return price * 0.05613;
        } else if (name2 === "BLO") {
            name2 = "USD";
            const price = await getPrice(name1, name2);
            setSwapPrice(price / 0.05613);
            setAmount2((price / 0.05613) * amount);
            return price / 0.05613;
        }
        const price = await getPrice(name1, name2);
        setSwapPrice(price);
        setAmount2(price * amount);
        if (value === 0) {
            setAmount2(0);
            return 0;
        }
        return price;
    };

    useEffect(() => {
        const token = tokens[select1];
        const address = token.address;

        checkBalance(address).then((amount) => {
            setBal1(amount);
        });
    }, [select1]);

    useEffect(() => {
        const token = tokens[select2];
        const address = token.address;

        checkBalance(address).then((amount) => {
            setBal2(amount);
        });
    }, [select2]);

    useEffect(() => {
        checkPrice(amount1);
    }, [amount1, select1, select2]);

    useEffect(() => {
        setTokens(DEFAULT_TOKENS);
    }, [DEFAULT_TOKENS]);

    const reverse_swap = () => {
        setSelect1(select2);
        setSelect2(select1);
        setAmount1(amount2);
        setAmount2(amount1);
    };

    const swapHandler = async () => {
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
                const router_contract = new ethers.Contract(router_address, router_abi, signer);
                const amount_in = (amount1 * 10 ** decimal1).toString();
                let amount_out = swapPrice * amount1 * 10 ** decimal2;
                amount_out = Math.round((amount_out * (100 - slippage)) / 100).toString();

                console.log(amount_out);

                if (addr1 === ADDR_WETH) {
                    let swap = await router_contract.swapExactNATIVEForTokens(amount_out, [[15], [2], [addr1, addr2]], account, Date.now() + 10 * 60, {
                        value: amount_in
                    });
                    const swap_receipt = await swap.wait();
                    if (swap_receipt && swap_receipt.blockNumber && swap_receipt.status === 1) {
                        openSnackbar("Swapping transaction successful", "success");
                    }
                } else if (addr2 === ADDR_WETH) {
                    let swap = await router_contract.swapExactTokensForNATIVE(amount_in, amount_out, [[15], [2], [addr1, addr2]], account, Date.now() + 10 * 60);
                    const swap_receipt = await swap.wait();
                    if (swap_receipt && swap_receipt.blockNumber && swap_receipt.status === 1) {
                        openSnackbar("Swapping transaction successful", "success");
                    }
                } else {
                    let swap = await router_contract.swapExactTokensForTokens(amount1, amount_out, [[15], [2], [addr1, addr2]], account, Date.now() + 10 * 60);
                    const swap_receipt = await swap.wait();
                    if (swap_receipt && swap_receipt.blockNumber && swap_receipt.status === 1) {
                        openSnackbar("Swapping transaction successful", "success");
                    }
                }
            } else {
                console.log("Object does not exist");
            }
        } catch (e) {
            if (e.reason === "insufficient funds for intrinsic transaction cost") {
                openSnackbar("Insufficient funds for intrinsic transaction cost!", "error");
            } else if (e.reason === "invalid BigNumber string") {
                openSnackbar("Transaction will be failed, Please increase Slippage", "error");
            } else if (e.reason === "missing revert data in call exception") {
                openSnackbar("Token is not approved yet, Please approve token", "error");
            } else {
                console.log(e);
                openSnackbar("Error Occured while exchanging. " + e.message, "error");
            }
        }
    };
    const approveHanderCallback = async() => {
        // const allow = await checkAllowance();
        setAllowance(allow);
    }
    const approveHandler = async () => {
        const token1 = tokens[select1];
        const addr1 = token1.address;
        approveHandlerMetamask(addr1, token_abi, router_address, openSnackbar, approveHanderCallback);
    };

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
            console.log("Valid Ethereum address:", value);
            for (let i = 0; i < DEFAULT_TOKENS.length; i++) {
                if (DEFAULT_TOKENS[i].address === value.toString()) {
                    openSnackbar("Already added token", "error");
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
                        description: "Found by address",
                        logo: "static/default.svg"
                    };
                    setImportData(data);
                }
            });
        } else {
            if (value != 0) openSnackbar("Wrong address! Please input correct Address.", "error");
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

    return (
        <Box>
            <Stack alignItems="center" justifyContent="center" minHeight="84vh">
                <Box
                    minWidth="38vw"
                    sx={{
                        borderRadius: "10px",
                        border: darkMode ? "solid 2px rgb(255, 255, 255)" : "solid 2px rgb(0, 0, 0, 0.3)",
                        padding: "15px 35px",
                        mt: 1
                    }}
                >
                    <Stack direction="row" display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h3">Unibit Swap</Typography>
                        <SwapSetting slippage={slippage} setSlippage={setSlippage} />
                    </Stack>
                    <br />
                    <Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                                border: darkMode ? "solid 1px rgb(255, 255, 255)" : "solid 1px rgb(0, 0, 0, 0.3)",
                                borderRadius: "10px",
                                padding: "20px 20px"
                            }}
                        >
                            <Stack>
                                <Button id="token1" value={select1} variant="outlined" onClick={() => setOpenSelect1(true)} sx={{ minWidth: 120, padding: "10px 0px" }}>
                                    <Stack direction="row" spacing={0.8} alignItems="center">
                                        <img style={{ height: 23 }} src={DEFAULT_TOKENS[select1].logo} />
                                        <Typography variant="s4">{DEFAULT_TOKENS[select1].symbol}</Typography>
                                        <ArrowDropDownIcon />
                                    </Stack>
                                </Button>
                                {openSelect1 && (
                                    <BootstrapDialog open={openSelect1} onClose={() => setOpenSelect1(false)} aria-labelledby="Select-title">
                                        <BootstrapDialogTitle id="Select-title" onClose={() => setOpenSelect1(false)}>
                                            <Typography variant="h3">Select a Token</Typography>
                                        </BootstrapDialogTitle>
                                        <Box alignItems="center" sx={{ mt: 1, mb: 2, ml: 2, mr: 2 }}>
                                            <TextField
                                                placeholder="Search Token by address"
                                                fullWidth
                                                value={search}
                                                onChange={handleSearch}
                                                InputProps={{
                                                    type: "search",
                                                    startAdornment: (
                                                        <InputAdornment position="start" sx={{ mr: 0.7 }}>
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: <InputAdornment position="end" />
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
                                                    <Button variant="outlined" sx={{ ":hover": { background: "#1fc7d4" } }} onClick={importHandler1}>
                                                        Import
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <>
                                                    {tokens.map((row, idx) => (
                                                        <MenuItem key={row.id} value={row.id} spacing={2} onClick={() => handleSelect1(row.id)}>
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
                                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                                    <Typography>Balance: {Math.round(bal1 * 100000) / 100000}</Typography>
                                    {bal1 > 0 && (
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                maxHeight: "25px",
                                                color: "black",
                                                border: "1px solid rgb(0, 0, 0)",
                                                borderRadius: "10px"
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
                            <Input
                                display="flex"
                                onChange={(e) => {
                                    setAmount1(e.target.value);
                                }}
                                value={amount1}
                                placeholder="0.0"
                                disableUnderline
                                sx={{
                                    width: "100%",
                                    input: {
                                        autoComplete: "off",
                                        padding: "10px 0px",
                                        border: "none",
                                        fontSize: "18px",
                                        textAlign: "end",
                                        appearance: "none",
                                        fontWeight: 700
                                    }
                                }}
                            />
                        </Box>
                        <Box textAlign="center" alignItems="center" sx={{ m: -1.8 }}>
                            <SwapVerticalCircleIcon
                                onClick={() => {
                                    reverse_swap();
                                }}
                                sx={{ height: "35px", width: "35px", cursor: "pointer" }}
                            />
                        </Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                                border: darkMode ? "solid 1px rgb(255, 255, 255)" : "solid 1px rgb(0, 0, 0, 0.3)",
                                borderRadius: "10px",
                                padding: "20px 20px"
                            }}
                        >
                            <Stack>
                                <Button id="token2" value={select2} variant="outlined" onClick={() => setOpenSelect2(true)} sx={{ minWidth: 120, padding: "10px 0px" }}>
                                    <Stack direction="row" spacing={0.8} alignItems="center">
                                        <img style={{ height: 23 }} src={DEFAULT_TOKENS[select2].logo} />
                                        <Typography variant="s4">{DEFAULT_TOKENS[select2].symbol}</Typography>
                                        <ArrowDropDownIcon />
                                    </Stack>
                                </Button>
                                {openSelect2 && (
                                    <BootstrapDialog open={openSelect2} onClose={() => setOpenSelect2(false)} aria-labelledby="Select-title">
                                        <BootstrapDialogTitle id="Select-title" onClose={() => setOpenSelect2(false)}>
                                            <Typography variant="h3">Select a Token</Typography>
                                        </BootstrapDialogTitle>
                                        <Box alignItems="center" sx={{ mt: 1, mb: 2, ml: 2, mr: 2 }}>
                                            <TextField
                                                placeholder="Search Token by address"
                                                fullWidth
                                                value={search}
                                                onChange={handleSearch}
                                                InputProps={{
                                                    type: "search",
                                                    startAdornment: (
                                                        <InputAdornment position="start" sx={{ mr: 0.7 }}>
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: <InputAdornment position="end" />
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ width: { md: "450px" } }} alignItems="center" padding="10px 15px">
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
                                                    <Button variant="outlined" sx={{ ":hover": { background: "#1fc7d4" } }} onClick={importHandler2}>
                                                        Import
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <>
                                                    {tokens.map((row, idx) => (
                                                        <MenuItem key={row.id} value={row.id} spacing={2} onClick={() => handleSelect2(row.id)}>
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
                                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                                    <Typography>Balance: {Math.round(bal2 * 100000) / 100000}</Typography>
                                </Box>
                            </Stack>
                            <Input
                                display="flex"
                                onChange={(e) => {
                                    setAmount2(e.target.value);
                                }}
                                value={amount2}
                                placeholder="0.0"
                                disableUnderline
                                disabled
                                sx={{
                                    width: "100%",
                                    input: {
                                        autoComplete: "off",
                                        padding: "10px 0px",
                                        border: "none",
                                        fontSize: "18px",
                                        textAlign: "end",
                                        appearance: "none",
                                        fontWeight: 700
                                    }
                                }}
                            />
                        </Box>
                        <br />
                        <Box padding="10px">
                            <Stack display="flex" justifyContent="space-between" direction="row">
                                <Typography variant="s1">Slippage</Typography>
                                <Typography variant="s1">{slippage === 100 ? "Auto" : `${slippage}%`}</Typography>
                            </Stack>
                            <Stack display="flex" justifyContent="space-between" direction="row">
                                <Typography variant="s1">Price</Typography>
                                <Typography variant="s1">
                                    {swapPrice} {DEFAULT_TOKENS[select2].symbol} per {DEFAULT_TOKENS[select1].symbol}
                                </Typography>
                            </Stack>
                            <Stack display="flex" justifyContent="space-between" direction="row">
                                <Typography variant="s1">fee</Typography>
                                <Typography variant="s1">0.3%</Typography>
                            </Stack>
                        </Box>
                        <Box display="flex" justifyContent="space-around" alignItems="center" textAlign="center" sx={{ mt: 1 }} width="100%">
                            {walletAccount ? (
                                <SwapButton allowance={allowance} amount1={amount1} approveHandler={approveHandler} swapHandler={swapHandler} />
                            ) : (
                                <SwapConnectButton showConnectWallet={() => showConnectWallet()} />
                            )}
                        </Box>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
}
