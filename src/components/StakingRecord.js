import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { claimAndWithdraw, getDetails } from "src/utils/stakingHandlers";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { format } from "date-fns";
import { Button } from "@mui/material";
import { AppContext } from "src/AppContext";
import errorMessageParser from "src/utils/errorMessageParser";

export default function StakingRecord({ lockTime, rates, MULTIPLYER }) {
    const [record, setRecord] = useState();
    const { openSnackbar, loading, setLoading } = useContext(AppContext);

    useEffect(() => {
        getDetailsHander();
    }, [lockTime]);
    const getDetailsHander = async () => {
        try {
            const result = await getDetails(lockTime);
            const rr = result.toString().split(",");
            console.log(result, rr);
            setRecord({
                amount: ethers.utils.formatEther(rr[0]),
                rewards: ethers.utils.formatEther(rr[2]),
                apr: rates[rr[3]].rate / MULTIPLYER,
                period: rates[rr[3]].period,
                endsOn: format(new Date(parseInt(lockTime.toString()) * 1000), "MMM do, yyyy"),
                available: rr[4]
            });
        } catch (error) {
            console.log("Error: ", error);
            openSnackbar(
                <div style={{ maxWidth: 500 }}>
                    <p>Error occured while getting stake details. </p>
                    <p>{errorMessageParser(error.message)}</p>
                </div>,
                "error"
            );
        }
    };

    const claimHandler = async () => {
        setLoading(true);
        try {
            await claimAndWithdraw(lockTime);
        } catch (error) {
            console.log("Error: ", error);
            openSnackbar(
                <div style={{ maxWidth: 500 }}>
                    <p>Error occured while claiming and withdrawing. </p>
                    <p>{errorMessageParser(error.message)}</p>
                </div>,
                "error"
            );
        }
        setLoading(false);
        await getDetailsHander();
    };
    return (
        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell align="center">{record?.amount}</TableCell>
            <TableCell align="center">{record?.apr}%</TableCell>
            <TableCell align="center">{record?.period} days</TableCell>
            <TableCell align="center">{record?.endsOn}</TableCell>
            <TableCell align="center">{record?.rewards}</TableCell>
            <TableCell align="right">
                <Button variant="outlined" onClick={claimHandler} disabled={record?.available === "false"}>
                    Claim and unstake
                </Button>
            </TableCell>
        </TableRow>
    );
}
