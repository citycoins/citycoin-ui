import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { atom } from 'jotai';
import {
  CITYCOIN_CORE,
  CONTRACT_DEPLOYER,
  NETWORK,
  STACKS_API_FEE_URL,
  STACKS_API_V2_INFO,
} from './constants';

export const BLOCK_HEIGHT = atom({ value: 0, loading: false });
export const REWARD_CYCLE = atom({ value: 0, loading: false });

export async function refreshBlockHeight(block) {
  try {
    block(v => {
      return { value: v.value, loading: true };
    });
    const result = await fetch(STACKS_API_V2_INFO);
    const resultJson = await result.json();
    block(() => {
      return { value: resultJson?.stacks_tip_height, loading: false };
    });
  } catch (e) {
    console.log(e);
    block(v => {
      return { value: v.value, loading: false };
    });
  }
}

export async function refreshRewardCycle() {
  try {
    const apiResult = await fetch(STACKS_API_V2_INFO);
    const apiResultJson = await apiResult.json();
    const block = apiResultJson.stacks_tip_height;
    const resultCV = await callReadOnlyFunction({
      contractAddress: CONTRACT_DEPLOYER,
      contractName: CITYCOIN_CORE,
      functionName: 'get-reward-cycle',
      functionArgs: [uintCV(block)],
      network: NETWORK,
      senderAddress: CONTRACT_DEPLOYER,
    });
    const resultJSON = cvToJSON(resultCV);
    return resultJSON.value.value;
  } catch (e) {
    console.log(e);
  }
}

export async function getFirstBlockInCycle(cycle) {
  const resultCV = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-first-stacks-block-in-reward-cycle',
    functionArgs: [uintCV(cycle)],
    network: NETWORK,
    senderAddress: CONTRACT_DEPLOYER,
  });
  const resultJSON = cvToJSON(resultCV);
  return resultJSON.value;
}

export async function getStxFees() {
  // get estimated fee from API, returns integer
  const result = await fetch(STACKS_API_FEE_URL);
  const feeValue = await result.json();
  return feeValue;
}
