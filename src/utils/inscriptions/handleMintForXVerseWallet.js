import { createInscription } from "sats-connect";
import { defaultNetwork } from "../constants";
// pass toast func() and walletAccount(ordinals address)
const handleMintForXVerseWallet = async (openSnackbar, walletAccount) => {  
  // prepare payload
  const payload = {
    network: {
      type: defaultNetwork,
    },
    contentType: "text/html",
    content: "My inscription text",
    payloadType: "PLAIN_TEXT"
  }

  // send inscription request
  try {
    await createInscription({
      payload: payload,
      onFinish: (response) => {
        console.log("Inscription result for xverse wallet: ", response);
        openSnackbar("Inscription cancelled!", "success");
      },
      onCancel: () => {
        openSnackbar("Inscription cancelled!", "warning");
      },
    });
  } catch (error) {
    console.log("Error while inscription for xverse: ", error);
    openSnackbar("Inscription failed with message: " + error.message);
  }
}

export default handleMintForXVerseWallet;