import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
  BLOCK_HEIGHT,
  getFirstBlockInCycle,
  refreshBlockHeight,
  refreshRewardCycle,
  REWARD_CYCLE,
} from '../lib/blocks';
import { REWARD_CYCLE_LENGTH } from '../lib/constants';

export function CurrentRewardCycle() {
  const [blockHeight, setBlockHeight] = useAtom(BLOCK_HEIGHT);
  const [rewardCycle, setRewardCycle] = useState();
  const [firstBlockInCycle, setFirstBlockInCycle] = useState();
  const rewardCycleLength = REWARD_CYCLE_LENGTH;

  useEffect(() => {
    refreshBlockHeight(setBlockHeight);
  }, [setBlockHeight]);

  useEffect(() => {
    refreshRewardCycle(blockHeight.value).then(cycle => {
      setRewardCycle(cycle);
    });
    getFirstBlockInCycle(rewardCycle).then(firstBlock => {
      setFirstBlockInCycle(firstBlock);
    });
  }, []);

  if (!isNaN(rewardCycle) && rewardCycle !== 0) {
    return (
      <>
        <p>Current Reward Cycle: {rewardCycle}</p>
        <ul>
          {' '}
          <li>First Block: {firstBlockInCycle}</li>
          <li>Last Block: {firstBlockInCycle + rewardCycleLength}</li>
        </ul>
      </>
    );
  } else {
    return <p>Current Reward Cycle: Unknown</p>;
  }
}
