import React, { useState, useContext } from 'react'

// Material
import {
  Container,
  Stack,
  TextField,
  Button,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
// Context
import { AppContext } from "src/AppContext";
// Utils
import { getAddress, signMessage } from "sats-connect";
import handleMintForXVerseWallet from 'src/utils/inscriptions/handleMintForXVerseWallet';
import handleMintForUnisatWallet from 'src/utils/inscriptions/handleMintForUnisatWallet';

export default function MintBRC20Button() {
  const { openSnackbar, walletContext } = useContext(AppContext);
  const { walletType, walletAccount, WalletTypes} = walletContext;
  const mintBRC20 = () => {
    if(walletType === WalletTypes.none) {
      openSnackbar("Please connect wallet!", "warning");
      return;
    }
    openSnackbar("minting BRC20 token");
    console.log(walletAccount, walletType);
    switch (walletType) {
      case WalletTypes.xverse:
        handleMintForXVerseWallet(openSnackbar, walletAccount);
        break;
      case WalletTypes.unisat:
        handleMintForUnisatWallet(openSnackbar, walletAccount);
        break;
      default:
        openSnackbar("Minting BRC20 for your wallet type is not supported yet.", "warning");
    }
  }

  
  return (
    <Button
        sx={{ padding: 1, width: "35%" }}
        onClick={() => mintBRC20()}
        variant="contained"
    >
        Create
    </Button>
  )
}
