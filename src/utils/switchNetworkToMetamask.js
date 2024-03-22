import Web3 from "web3";
const switchNetworkTo = async(network, openSnackbar, setLoading) => {
  try {
    await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{
            chainId: Web3.utils.toHex(network.chainId)
        }]
    })
  } catch (error) {
      openSnackbar("Error occured: " + error.message, "error");
      console.log("Error while switching network: ", error);
  }
  setLoading(false);
}

export default switchNetworkTo;