import React, { useEffect } from 'react'
import StakingRecord from './StakingRecord'
import { AppContext } from "src/AppContext";
import { ethers } from "ethers";
import { getLockTimes } from 'src/utils/stakingHandlers';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default function StakingRecords() {
  const { openSnackbar, darkMode, walletContext, loading, setLoading } = useContext(AppContext);
  const { walletAccount } = walletContext;
  const [lockTimes, setLockTimes] = useState([]);
  const getDataHander = async() => {
    if(!walletAccount) {
      setLockTimes([]);
      return;
    }
    //
    try {
      const lts = await getLockTimes();
      console.log(lts);
      setLockTimes(lts);
    } catch (error) {
      openSnackbar(<div style={{ maxWidth: 500 }}>
        <p>Error occured. </p>
        <p>{error.message}</p>
      </div>, "error");
      console.error(error);
    }
  }

  useEffect(() => {
    getDataHander();
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Staked Amount</TableCell>
            <TableCell align="right">APR(%)</TableCell>
            <TableCell align="right">Lock Period(days)</TableCell>
            <TableCell align="right">Unlocked on</TableCell>
            <TableCell align="right">Rewards</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lockTimes.map((time, idx) => (
            <StakingRecord lockTime={time} key={idx}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
