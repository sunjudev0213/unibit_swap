import { bitcoinNetworks, mainNetConfig, testNetConfig } from "./networks";

const getConfig = () => {
    const config = {
        EVMDefaultNetwork: testNetConfig.EvmChainDefinitions.Ethereum,
        BitcoinDefaultNetwork: bitcoinNetworks.testnet,
        WalletTypes: {
            none: 0,
            metamask: 1,
            xverse: 2,
            unisat: 3
        },
        StakingDefaultAPY: "50"
    };

    if (process.env.Environment === "production") {
        config.EVMDefaultNetwork = mainNetConfig.EvmChainDefinitions.Arbitrum;
        config.BitcoinDefaultNetwork = bitcoinNetworks.mainnet;
    }

    return config;
};

export default getConfig;
