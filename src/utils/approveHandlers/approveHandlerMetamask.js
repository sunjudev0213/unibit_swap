import { ethers } from "ethers";

const approveHandlerMetamask = async (
  token,
  token_abi,
  router_address,
  openSnackbar,
  callback,
  setLoading
) => {
  try {
      const { ethereum } = window;
      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const token_contract = new ethers.Contract(token, token_abi, signer);
          let approve = await token_contract.approve(router_address, "0xffffffffffffffffffffffffffffffffffffff");
          const approve_receipt = await approve.wait();
          if (approve_receipt && approve_receipt.blockNumber && approve_receipt.status === 1) {              
              openSnackbar("Token Approoval transaction successful", "success");
              await callback();
              setLoading(false);
          }
      } else {
          openSnackbar("Wallet not connected", "error");
          setLoading(false);
      }
  } catch (e) {
      console.log("Approval transaction failed", e);
      openSnackbar("Approval transaction failed. " + e.message, "error");
      setLoading(false);
  }
};

export default approveHandlerMetamask;