async function connectUnisat(
  handleCloseWallet, setWalletAccount, setWalletType, WalletTypes, openSnackbar
) {
  const unisat = window.unisat;

  if (!unisat) {
      openSnackbar("Unisat is not installed! Go install the extension!", "error");
      return;
  }
  try {
      // keep track of accounts returned
      let accounts = await unisat.requestAccounts();
      console.info("Unisat Wallet: ", accounts);
      handleCloseWallet();
      setWalletAccount(accounts[0]);
      setWalletType(WalletTypes.unisat);
      openSnackbar("Unisat Wallet is connected!", "success");
  } catch (error) {
      console.error("Error while connecting Unisat wallet: ", error);
      openSnackbar(error.message, "error");
  }

}

export default connectUnisat;