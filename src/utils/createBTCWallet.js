import { bip39, BigNumber } from '@okxweb3/crypto-lib';
import { BtcWallet } from '@okxweb3/coin-bitcoin';

export const getWallet = () => {
  const walletInfo = sessionStorage.getItem('btc-wallet');
  console.log(walletInfo);
  const decoded = atob(walletInfo);
  const wallet = JSON.parse(decoded);
  return wallet;
};

export const createWallet = async () => {
  // btc wallet
  let wallet = new BtcWallet();

  // get menmonic
  let mnemonic = await bip39.generateMnemonic();
  console.log('generate mnemonic:', mnemonic);

  // get derived key
  const hdPath = await wallet.getDerivedPath({ index: 0, segwitType: 4 });
  let derivePrivateKey = await wallet.getDerivedPrivateKey({
    mnemonic,
    hdPath
  });
  console.log(
    'generate derived private key: ',
    derivePrivateKey,
    ', derived path:   ',
    hdPath
  );

  // get new address
  let newAddress = await wallet.getNewAddress({
    privateKey: derivePrivateKey,
    addressType: 'segwit_taproot'
  });
  console.log('generate new address:', newAddress.address);

  const walletObj = {
    address: newAddress,
    privateKey: privateKey,
    mnemonic: mnemonic,
    hdPath: hdPath
  };
  const encoded = btoa(JSON.stringify(walletObj));
  sessionStorage.setItem('btc-wallet', encoded);
};
