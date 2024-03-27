import React, { useEffect, useState } from 'react'
import { getDetails } from 'src/utils/stakingHandlers';

export default function StakingRecord({ lockTime }) {
  const [record, setRecord] = useState();
  useEffect(() => {
    getDetailsHander();
  }, [
    lockTime
  ])
  const getDetailsHander = async() => {
    try {
      const rr = await getDetails(lockTime);
      console.log(rr);
      setRecord({
        amount: rr[0],
        apr: rr[1],
        period: rr[2],
        endsOn: "",
        rewards: rr[3],
        available: rr[4]
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell omponent="th" scope="row">{ record.amount }</TableCell>
      <TableCell align="right">{ record.apr }</TableCell>
      <TableCell align="right">{ record.period }</TableCell>
      <TableCell align="right">{ record.endsOn }</TableCell>
      <TableCell align="right">{ record.rewards }</TableCell>
      <TableCell align="right">Claim</TableCell>
    </TableRow>
  )
}
