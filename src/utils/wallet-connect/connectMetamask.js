async function connectMetamask(handleCloseWallet, setWalletAccount, setWalletType, WalletTypes, openSnackbar) {
  const { ethereum } = window;

  if (!ethereum) {
      openSnackbar("Metamask is not installed! Go install the extension!", "error");
      return;
  }
  try {
    // keep track of accounts returned
    let accounts = await ethereum.request({
        method: "eth_requestAccounts"
    });
    handleCloseWallet();
    setWalletAccount(accounts[0]);
    setWalletType(WalletTypes.metamask);
  } catch (error) {
    console.error("Error while connecting metamask wallet: ", error);
    openSnackbar(error.message, "error");
  }
  
}

export default connectMetamask;