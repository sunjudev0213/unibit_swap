import { useState, useContext, useEffect } from "react";
// Material
import { Box, Stack, TextField, Button, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
// Context
import { AppContext } from "src/AppContext";
//component
import Page from "src/components/Page";
import CreateBRC20Button from "./CreateBRC20Button";
import WalletConnectButton from "./WalletConnectButton";
import getUnisatOrder from "src/utils/inscriptions/getUnisatOrder";
import CreateRunesButton from "./Runes/CreateRunesButton";

export default function RunesComponent() {
    const { openSnackbar, darkMode, walletContext, modalContext } = useContext(AppContext);
    const { walletAccount, walletType, WalletTypes } = walletContext;
    const { showConnectWallet } = modalContext;
    const [runeName, setRuneName] = useState("");
    const [runeSymbol, setRuneSymbol] = useState("");
    const [runeDivisibility, setRuneDivisibility] = useState();
    const [runePremine, setRunePremine] = useState();
    const [isMintable, setIsMintable] = useState(true);
    const [amount, setAmount] = useState();
    const [cap, setCap] = useState();
    const [destinationAddress, setDestinationAddress] = useState();
    const [repeats, setRepeats] = useState(1);

 
    const [tokenMax, setTokenMax] = useState("");
    const [tokenLim, setTokenLim] = useState("");
    const [mintAm, setMintAm] = useState("");
    const [receiverAddress, setReceiverAddress] = useState();
    const [customCode, setCustomCode] = useState("");
    const [createType, setCreateType] = useState("Etch");
    const [orderData, setOrderData] = useState();
    const [orderId, setOrderId] = useState("");
    const updateOrderData = async () => {
        openSnackbar("Updating order data.", "success");
        const orderDetail = await getUnisatOrder(openSnackbar, orderData.orderId);
        setOrderData(orderDetail);
    };

    useEffect(() => {
        if (walletAccount) {
            setDestinationAddress(walletAccount.address);
        }
    }, walletAccount);

    return (
        <Page title="Runes">
            <Stack justifyContent="center" alignItems="center" display="flex" minHeight="80vh">
                <Box
                    maxWidth="md"
                    minWidth="35vw"
                    sx={{
                        borderRadius: "10px",
                        border: darkMode ? "1px solid rgb(255, 255, 255)" : "1px solid rgb(0, 0, 0, 0.3)",
                        padding: "20px 30px"
                    }}
                >
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={createType}
                            onChange={(e) => {
                                setCreateType(e.target.value);
                            }}
                        >
                            <FormControlLabel value="Etch" control={<Radio />} label="Etch" />
                            <FormControlLabel value="Mint" control={<Radio />} label="Mint" />
                            <FormControlLabel value="Detail" control={<Radio />} label="Inscription Detail" />
                        </RadioGroup>
                    </FormControl>
                    {
                        createType === "Etch" ?
                        <>
                            <Stack spacing={2} marginBottom={3} marginTop={3}>
                                <Typography variant="h3">Etch a new Rune</Typography>
                                <Typography variant="caption">Name</Typography>
                                <TextField
                                    required
                                    placeholder="Rune Name"
                                    margin="dense"
                                    onChange={(e) => {
                                        setRuneName(e.target.value);
                                    }}
                                    value={runeName}
                                    sx={{
                                        "&.MuiTextField-root": {
                                            marginTop: 1
                                        }
                                    }}
                                />
                            </Stack>
                            <Stack spacing={2} marginBottom={3}>
                                <Typography variant="caption">Symbol (optional)</Typography>
                                <TextField
                                    required
                                    placeholder="Rune Symbol"
                                    margin="dense"
                                    onChange={(e) => {
                                        setRuneSymbol(e.target.value);
                                    }}
                                    value={runeSymbol}
                                    sx={{
                                        "&.MuiTextField-root": {
                                            marginTop: 1
                                        }
                                    }}
                                />
                            </Stack>
                            <Stack spacing={2} marginBottom={3}>
                                <Typography variant="caption">Is Mintable</Typography>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={isMintable}
                                    onChange={(e) => {
                                        if (e.target.value === "true") {
                                            setIsMintable(true);
                                        } else {
                                            setIsMintable(false);
                                        }
                                    }}
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio />} label="No" />
                                </RadioGroup>
                            </Stack>
                            {
                                isMintable ?
                                <>
                                    <Stack spacing={2} marginBottom={3}>
                                        <Typography variant="caption">Divisibility (optional)</Typography>
                                        <TextField
                                            placeholder="Rune Divisibility"
                                            margin="dense"
                                            onChange={(e) => {
                                                setRuneDivisibility(e.target.value);
                                            }}
                                            value={runeDivisibility}
                                            sx={{
                                                "&.MuiTextField-root": {
                                                    marginTop: 1
                                                }
                                            }}
                                            type="number"
                                        />
                                    </Stack>
                                    <Stack spacing={2} marginBottom={3}>
                                        <Typography variant="caption">Runes Total Supply</Typography>
                                        <TextField
                                            placeholder="Rune Total Supply"
                                            margin="dense"
                                            onChange={(e) => {
                                                setAmount(e.target.value);
                                            }}
                                            value={amount}
                                            sx={{
                                                "&.MuiTextField-root": {
                                                    marginTop: 1
                                                }
                                            }}
                                            type="number"
                                        />
                                    </Stack>
                                    <Stack spacing={2} marginBottom={3}>
                                        <Typography variant="caption">Minted Runes per Txn</Typography>
                                        <TextField
                                            placeholder="Runes minted per txn"
                                            margin="dense"
                                            onChange={(e) => {
                                                setCap(e.target.value);
                                            }}
                                            value={cap}
                                            sx={{
                                                "&.MuiTextField-root": {
                                                    marginTop: 1
                                                }
                                            }}
                                            type="number"
                                        />
                                    </Stack>
                                    <Stack spacing={2} marginBottom={3}>
                                        <Typography variant="caption">Runes Premine (optional)</Typography>
                                        <TextField
                                            placeholder="Rune Premine"
                                            margin="dense"
                                            onChange={(e) => {
                                                setRunePremine(e.target.value);
                                            }}
                                            value={runePremine}
                                            sx={{
                                                "&.MuiTextField-root": {
                                                    marginTop: 1
                                                }
                                            }}
                                            type="number"
                                        />
                                    </Stack>
                                </> : 
                                <>
                                    <Stack spacing={2} marginBottom={3}>
                                        <Typography variant="caption">Runes Premine</Typography>
                                        <TextField
                                            placeholder="Rune Premine"
                                            margin="dense"
                                            onChange={(e) => {
                                                setRunePremine(e.target.value);
                                            }}
                                            value={runePremine}
                                            sx={{
                                                "&.MuiTextField-root": {
                                                    marginTop: 1
                                                }
                                            }}
                                            type="number"
                                        />
                                    </Stack>
                                </>
                            }
                        </> : createType === "Mint" ?
                        <>
                            <Stack spacing={2} marginBottom={3} marginTop={3}>
                                <Typography variant="h3">Mint Runes</Typography>
                                <Typography variant="caption">Rune Name</Typography>
                                <TextField
                                    required
                                    placeholder="Rune Name"
                                    margin="dense"
                                    onChange={(e) => {
                                        setRuneName(e.target.value);
                                    }}
                                    value={runeName}
                                    sx={{
                                        "&.MuiTextField-root": {
                                            marginTop: 1
                                        }
                                    }}
                                />
                            </Stack>
                            <Stack spacing={2} marginBottom={3}>
                                <Typography variant="caption">Mint Repeats</Typography>
                                <TextField
                                    required
                                    placeholder="Mint Repeats"
                                    margin="dense"
                                    onChange={(e) => {
                                        setRepeats(e.target.value);
                                    }}
                                    value={repeats}
                                    sx={{
                                        "&.MuiTextField-root": {
                                            marginTop: 1
                                        }
                                    }}
                                    type="number"
                                />
                            </Stack>
                            <Stack spacing={2} marginBottom={3}>
                                <Typography variant="caption">Receiver Address</Typography>
                                <TextField
                                    required
                                    disabled
                                    placeholder="Receiver Address"
                                    margin="dense"
                                    onChange={(e) => {
                                        setReceiverAddress(e.target.value);
                                    }}
                                    value={receiverAddress}
                                    sx={{
                                        "&.MuiTextField-root": {
                                            marginTop: 1
                                        }
                                    }}
                                />
                            </Stack>
                        </> :
                        <>
                            <Stack spacing={2} marginBottom={3} marginTop={3}>
                                <Typography variant="h3">Inscription Order Detail</Typography>
                                <Typography variant="caption">Order ID</Typography>
                                <TextField
                                    required
                                    placeholder="Order ID"
                                    margin="dense"
                                    onChange={(e) => {
                                        setOrderId(e.target.value);
                                    }}
                                    value={orderId}
                                    sx={{
                                        "&.MuiTextField-root": {
                                            marginTop: 1
                                        }
                                    }}
                                />
                            </Stack>
                        </>
                    }
                    <Stack display="flex" justifyContent="space-around" alignItems="center" textAlign="center" sx={{ mt: 1 }} width="100%">
                        {!walletAccount ? (
                            <WalletConnectButton showConnectWallet={showConnectWallet} />
                        ) : (
                            <Stack
                                spacing={2}
                                marginBottom={3}
                                marginTop={3}
                                direction="row"
                                alignItems="center"
                                justifyContent="space-around"
                                display="flex"
                                textAlign="center"
                                width="100%"
                            >
                                <CreateRunesButton 
                                    tick={runeName}
                                    max={tokenMax}
                                    lim={tokenLim}
                                    amt={mintAm}
                                    receiverAddress={receiverAddress}
                                    type={createType}
                                    setOrderData={setOrderData}
                                    orderId={orderId}
                                />
                                {
                                    orderData && createType !== "Detail" ?
                                    <Button sx={{ padding: 1, width: "35%" }} onClick={() => updateOrderData()} variant="contained">
                                        Update order Status
                                    </Button> : null
                                }
                            </Stack>
                        )}
                        {
                            orderData && walletType ?
                            <div>
                                <b>BRC20 Ticker</b>
                                <p>{JSON.parse(orderData.files[0].filename).tick}</p>
                                <b>Inscription Order ID</b><br></br>
                                <small>Save to check later</small>
                                <p>{orderData.orderId}</p>
                                <b>Inscription Status</b>
                                <p>{orderData.status}</p>
                                {
                                    orderData.files[0].inscriptionId ?
                                    <div>
                                        <b>Inscription detail</b><br></br>
                                        <a href={`https://testnet.unisat.io/inscription/${orderData.files[0].inscriptionId}`} target="_blank" rel="no-referrer">Check inscription detail</a>
                                    </div> :
                                    null
                                }
                            </div> :
                            null
                        }
                    </Stack>
                </Box>
            </Stack>
        </Page>
    );
}
