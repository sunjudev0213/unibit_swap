import { getAddress } from "sats-connect";
import { defaultNetwork } from "../constants";

async function connectXverse(
  handleCloseWallet, setWalletAccount, setWalletType, WalletTypes, openSnackbar
) {
  const getAddressOptions = {
      payload: {
          purposes: ["ordinals", "payment"],
          message: "Address for receiving Ordinals",
          network: {
              type: defaultNetwork
          }
      },
      onFinish: (response) => {
          const addresses = response.addresses
          console.info("XVerse Wallet: ", addresses);
          setWalletAccount(response.addresses[0].address);
          setWalletType(WalletTypes.xverse);
          handleCloseWallet();
          openSnackbar("XVerse Wallet is connected!", "success");
      },
      onCancel: (e) => {
          openSnackbar("Cancelled connecting wallet!", "error");
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