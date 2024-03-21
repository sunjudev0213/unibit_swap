import { ethers } from "ethers";
import Web3 from "web3";

import { ADDR_WETH as WETH, EU_pair, EB_pair } from "../constants";

const checkBalanceMetamask = async (token, token_abi, token1, token2) => {
    const { ethereum } = window;
    try {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0];
        const provider = new ethers.providers.Web3Provider(ethereum);
        const { chainId } = await provider.getNetwork();
        if (chainId != 42161) {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: Web3.utils.toHex(42161) }]
            });
        }
        if (token === WETH) {
            let amountETH = await provider.getBalance(account);
            amountETH = ethers.utils.formatEther(amountETH);
            return amountETH;
        } else {
            const signer = provider.getSigner();
            const token_contract = new ethers.Contract(token, token_abi, signer);
            try {
                let amount = (await token_contract.balanceOf(account)).toString();
                const decimal = await token_contract.decimals();
                if (token1 && token2) {
                    if (token === token1) {
                        setDecimal1(decimal.toString());
                    } else if (token === token2) {
                        setDecimal2(decimal.toString());
                    }
                }

                if (token === EU_pair || token === EB_pair) {
                    return Web3.utils.fromWei(amount);
                }
                amount = amount / 10 ** decimal;
                return amount;
            } catch (e) {
                console.log("Error while getting balance in metamask: ", e);
                return 0;
            }
        }
    } catch (e) {
        console.log("Wallet is not connected", e);
        return 0;
    }
};

export default checkBalanceMetamask;
