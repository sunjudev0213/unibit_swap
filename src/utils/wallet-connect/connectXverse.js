import { getAddress } from "sats-connect";

async function connectXverse(
  handleCloseWallet, setWalletAccount, setWalletType, WalletTypes, openSnackbar
) {
  const getAddressOptions = {
      payload: {
          purposes: ["ordinals", "payment"],
          message: "Address for receiving Ordinals",
          network: {
              type: process.env.NETWORK
          }
      },
      onFinish: (response) => {
          const addresses = response.addresses
          console.info("XVerse Wallet: ", addresses);
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

export default connectXverse;