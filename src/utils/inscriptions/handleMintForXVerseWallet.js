import { createInscription } from "sats-connect";
// pass toast func() and walletAccount(ordinals address)
export default handleMintForXVerseWallet = async (openSnackbar, walletAccount) => {
  // const signMessageOptions = {
  //   payload: {
  //     network: {
  //       type: "Testnet",
  //     },
  //     address: 'ordinalsAddress',
  //     message: "Hello World",
  //   },
  //   onFinish: (response) => {
  //     // signature
  //     alert(response);
  //   },
  //   onCancel: () => alert("Canceled"),
  // }
  // await signMessage(signMessageOptions);


  const contentType = "text/html"; 
  const content = "My inscription text";
  const payloadType = "PLAIN_TEXT";

  // optional parameters:
  const appFeeAddress = walletAccount; // the address where the inscription fee should go
  const appFee = 1500; // the amount of sats that should be sent to the fee address
  const suggestedMinerFeeRate = 10; // suggest a fee rate for the transaction in sats/byte
  try {
    await createInscription({
      payload: {
        network: {
          type: process.env.NETWORK,
        },
        contentType,
        content,
        payloadType,
        appFeeAddress,
        appFee,
        suggestedMinerFeeRate,
      },
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