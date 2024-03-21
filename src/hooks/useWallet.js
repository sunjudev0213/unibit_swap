import { useState } from "react";
import { WalletTypes } from "src/utils/constants";
export const useWallet = () => {
    const [walletAccount, setWalletAccount] = useState(null);
    const [walletType, setWalletType] = useState(WalletTypes.none);
    return { walletAccount, setWalletAccount, walletType, setWalletType, WalletTypes };
};
