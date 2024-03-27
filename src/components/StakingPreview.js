import React, { useContext } from "react";
import { addDays, format } from "date-fns";

// Material
import { Box, Typography } from "@mui/material";
import { AppContext } from "src/AppContext";
export default function StakingPreview({ rates, rateIndex, amountin, MULTIPLYER }) {
    const { darkMode } = useContext(AppContext);
    return (
        <Box
            p={2}
            sx={{
                border: darkMode ? "1px solid rgb(255, 255, 255, 0.5)" : "1px solid rgb(0, 0, 0, 0.3)",
                borderRadius: "10px"
            }}
        >
            <Box display="flex" mb={1} justifyContent="space-between" my={2}>
                <Typography variant="h4">Staking Amount:</Typography>
                <Typography>{amountin}</Typography>
            </Box>
            <Box display="flex" mb={1} justifyContent="space-between" my={2}>
                <Typography variant="h4">APR:</Typography>
                <Typography>{(rates[rateIndex].rate * 365) / MULTIPLYER}%</Typography>
            </Box>
            <Box display="flex" mb={1} justifyContent="space-between" my={2}>
                <Typography variant="h4">Locked Period:</Typography>
                <Typography>{rates[rateIndex].period} days</Typography>
            </Box>
            <Box display="flex" mb={1} justifyContent="space-between" my={2}>
                <Typography variant="h4">Ends on:</Typography>
                <Typography>{format(addDays(new Date(), rates[rateIndex].period), "MMM do, yyyy")}</Typography>
            </Box>
            <Box display="flex" mb={1} justifyContent="space-between" my={2}>
                <Typography variant="h4">Expected Rewards:</Typography>
                <Typography>{(amountin * rates[rateIndex].rate * rates[rateIndex].period) / MULTIPLYER / 100}</Typography>
            </Box>
        </Box>
    );
}
