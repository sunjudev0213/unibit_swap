import { createRepeatInscriptions } from "sats-connect";
import { defaultNetwork } from "../constants";

// pass toast func() and walletAccount(ordinals address)
const handleMintForXVerseWallet = async (openSnackbar, walletAccount) => {
    // prepare payload
    const mintJSON = {
        p: "brc-20",
        op: "mint",
        tick: "xversetest",
        amt: 1000
    };
    
    // inscription payload
    const payload = {
        network: {
            type: defaultNetwork
        },
        repeat: 1,
        contentType: "application/json",
        content: JSON.stringify(mintJSON),
        payloadType: "PLAIN_TEXT",
        /** Optional parameters:
    appFeeAddress: "", // the address where the inscription fee should go
    appFee: 1000, // the amount of sats that should be sent to the fee address
    */
        suggestedMinerFeeRate: 8
    };
    // send inscription request
    try {
        await createRepeatInscriptions({
            payload: payload,
            onFinish: (response) => {
                console.log("Inscription result for xverse wallet: ", response);
                openSnackbar("Inscription cancelled!", "success");
            },
            onCancel: () => {
                openSnackbar("Inscription cancelled!", "warning");
            }
        });
    } catch (error) {
        console.log("Error while inscription for xverse: ", error);
        openSnackbar("Inscription failed with message: " + error.message);
    }
};

export default handleMintForXVerseWallet;
