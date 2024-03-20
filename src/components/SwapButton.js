import { Button  } from "@mui/material";

const SwapButton = ({
  allowance,
  amount1,
  approveHandler,
  swapHandler
}) => {
  return (
      <>
          {allowance < amount1 ? (
              <Button fullWidth onClick={approveHandler} variant="outlined" sx={{ borderRadius: "10px", margin: "20px" }}>
                  <h3>Approve</h3>
              </Button>
          ) : (
              <Button fullWidth onClick={swapHandler} variant="outlined" sx={{ margin: "20px", borderRadius: "10px" }}>
                  <h3>Exchange</h3>
              </Button>
          )}
      </>
  );
};

export default SwapButton;