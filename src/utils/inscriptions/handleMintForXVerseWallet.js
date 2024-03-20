import { createRepeatInscriptions, signTransaction, createTransaction } from "sats-connect";
import * as btc from "@scure/btc-signer";
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

    // sign transaction
    try {
        const [error, psbtBase64] = await createTransaction({
            network: defaultNetwork,
            paymentAddress: walletAccount.paymentAddress,
            ordinalsAddress: walletAccount.address,
            paymentPublicKey: walletAccount.paymentPublicKey,
            ordinalsPublicKey: walletAccount.pubKey
        });

        if (error) {
            openSnackbar("Error creating transaction. Check console for error logs!", "error");
            console.error("Error creating transaction. ", error);
            return;
        }
        await signTransaction({
            payload: {
                network: {
                    type: defaultNetwork
                },
                message: "Sign Transaction",
                psbtBase64,
                broadcast: false,
                inputsToSign: [
                    {
                        address: walletAccount,
                        signingIndexes: [0],
                        sigHash: btc.SignatureHash.SINGLE | btc.SignatureHash.ANYONECANPAY
                    },
                    {
                        address: walletAccount,
                        signingIndexes: [1],
                        sigHash: btc.SignatureHash.SINGLE | btc.SignatureHash.ANYONECANPAY
                    }
                ]
            },
            onFinish: (response) => {
                openSnackbar("Signing success!", "success");
                console.log("Sign result of minting brc20 for xverse wallet: ", response);
            },
            onCancel: () => {
                openSnackbar("Inscription sign cancelled!", "warning");
            }
        });
    } catch (error) {
        console.log("Error while signing for xverse: ", error);
        openSnackbar("Inscription failed with message while signing: " + error.message);
    }
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
