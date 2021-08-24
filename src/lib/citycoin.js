import {
  ClarityType,
  cvToValue,
  hexToCV,
  uintCV,
  standardPrincipalCV,
  callReadOnlyFunction,
  cvToJSON,
} from '@stacks/transactions';
import {
  accountsApi,
  GENESIS_CONTRACT_ADDRESS,
  NETWORK,
  CONTRACT_DEPLOYER,
  CITYCOIN_CORE,
  CITYCOIN_TOKEN,
  REWARD_CYCLE_LENGTH,
} from './constants';

export async function getMiningStatsAtBlock(blockHeight) {
  const resultCV = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-mining-stats-at-block',
    functionArgs: [uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: CONTRACT_DEPLOYER,
  });
  const result = cvToJSON(resultCV);

  return result;
}

export async function getCityCoinBalance(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_TOKEN,
    functionName: 'get-balance',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: address,
  });
  return result.value.value.toNumber();
}

export async function getMiningActivationStatus() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-activation-status',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  if (result.type == ClarityType.BoolTrue) {
    return true;
  } else {
    return false;
  }
}

export async function getMiningActivationBlockHeight() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-activation-block',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  if (result.type === ClarityType.ResponseOk) {
    return result.value.value.toNumber();
  } else {
    return undefined;
  }
}

export async function getIsBlockWinner(ownerStxAddress, blockHeight) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'is-block-winner',
    functionArgs: [standardPrincipalCV(ownerStxAddress), uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: CONTRACT_DEPLOYER,
  });
  if (result.type === ClarityType.BoolTrue) {
    return true;
  } else {
    return false;
  }
}

export async function getRegisteredMinerId(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-user-id',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: address,
  });
  if (result.type === ClarityType.OptionalSome) {
    return result.value.value.toNumber();
  } else {
    return undefined;
  }
}

export async function getRegisteredMinerCount() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-registered-users-nonce',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  return result.value.toNumber();
}

export async function getRegisteredMinersThreshold() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-activation-threshold',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  return result.value.toNumber();
}
export async function getCoinbase(blockHeight) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-coinbase-amount',
    functionArgs: [uintCV(blockHeight)],
    senderAddress: CONTRACT_DEPLOYER,
    network: NETWORK,
  });
  return result.value.toNumber();
}

export async function getMiningDetails(stxAddress) {
  // get all account transactions
  const response = await accountsApi.getAccountTransactions({ principal: stxAddress });
  // filter transactions to successful mining calls
  const txs = response.results.filter(
    tx =>
      tx.tx_status === 'success' &&
      tx.tx_type === 'contract_call' &&
      (tx.contract_call.function_name === 'mine-tokens' ||
        tx.contract_call.function_name === 'mine-many') &&
      tx.contract_call.contract_id === `${CONTRACT_DEPLOYER}.${CITYCOIN_CORE}`
  );
  // get the miner's ID
  // const minerId = await getRegisteredMinerId(stxAddress);
  // set the winning details as empty
  const winningDetails = [];
  // for each mining transaction
  for (let tx of txs) {
    // if it was mine-many, iterate, otherwise get value
    if (tx.contract_call.function_name === 'mine-many') {
      let txResponse = tx.contract_call.function_args[0].repr;
      let txResponseSplit = txResponse.split(' ');
      for (let i = 0; i <= txResponseSplit.length - 1; i++) {
        winningDetails.push(await getWinningDetailsFor(tx.block_height + i, stxAddress));
      }
    } else {
      winningDetails.push(await getWinningDetailsFor(tx.block_height, stxAddress));
    }
  }
  return { count: winningDetails.length, winningDetails };
}

async function getWinningDetailsFor(blockHeight, stxAddress) {
  const isWinnerAtBlock = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'is-block-winner',
    functionArgs: [standardPrincipalCV(stxAddress), uintCV(blockHeight)],
    senderAddress: CONTRACT_DEPLOYER,
    network: NETWORK,
  });

  if (cvToValue(isWinnerAtBlock) === true) {
    const claim = await callReadOnlyFunction({
      contractAddress: CONTRACT_DEPLOYER,
      contractName: CITYCOIN_CORE,
      functionName: 'can-claim-mining-reward',
      functionArgs: [standardPrincipalCV(stxAddress), uintCV(blockHeight)],
      senderAddress: CONTRACT_DEPLOYER,
      network: NETWORK,
    });
    const canClaim = cvToValue(claim);
    const coinbase = await getCoinbase(blockHeight);
    return { blockHeight, winner: true, coinbase, canClaim };
  } else {
    return { blockHeight, lost: true };
  }
}

export async function getPoxLiteInfo() {
  const poxLiteInfo = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-pox-lite-info',
    functionArgs: [],
    senderAddress: CONTRACT_DEPLOYER,
    network: NETWORK,
  });
  return poxLiteInfo;
}

export async function getAvailableRewards(stxAddress, userId, cycleId) {
  const stackingReward = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-stacking-reward',
    functionArgs: [uintCV(userId), uintCV(cycleId)],
    senderAddress: stxAddress,
    network: NETWORK,
  });
  const cityCoinClaim = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-stacker-at-cycle',
    functionArgs: [uintCV(cycleId), uintCV(await getRegisteredMinerId(stxAddress))],
    senderAddress: stxAddress,
    network: NETWORK,
  });
  const result = {
    amountSTX: stackingReward.value.toNumber(),
    amountCC: cityCoinClaim.type,
    cycleId,
    stxAddress,
  };
  return result;
}

export async function getFirstStackingBlock() {
  const activationHeightCV = await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'get-activation-block',
    functionArgs: [],
    senderAddress: CONTRACT_DEPLOYER,
    network: NETWORK,
  });
  const activationHeight = cvToValue(activationHeightCV);
  const activationHeightValue = activationHeight.value;

  return activationHeightValue + REWARD_CYCLE_LENGTH;
}

export async function getStackingState(stxAddress) {
  const response = await accountsApi.getAccountTransactions({ principal: stxAddress });
  const txs = response.results.filter(
    tx =>
      tx.tx_status === 'success' &&
      tx.tx_type === 'contract_call' &&
      tx.contract_call.function_name === 'stack-tokens' &&
      tx.contract_call.contract_id === `${CONTRACT_DEPLOYER}.${CITYCOIN_CORE}`
  );
  const state = [];
  for (let tx of txs) {
    // for each stacking transaction
    // get single list of cycles user participated in via get-reward-cycle
    // based on the cycle
    // get stackerAtCycle for their info
    // get stackingStatsAtCycle for overall info
    // get firstStacksBlockInCycle + 2100 for last

    // By Cycle! Reward Cycle 1, stack up components

    // TODO use better tx result like this:
    /*
    const firstCycle = hexToCV(tx.tx_result).data.first.value.toNumber();
    const lastCycle = hexToCV(tx.tx_result).data.last.value.toNumber();
    */
    const firstCycle = Math.floor(
      (hexToCV(tx.contract_call.function_args[1].hex).value.toNumber() - 14726) / 50
    );
    const lockPeriod = hexToCV(tx.contract_call.function_args[1].hex).value.toNumber();
    const lastCycle = firstCycle + lockPeriod;

    for (let i = lastCycle; i >= firstCycle; i--) {
      state.push(await getAvailableRewards(stxAddress, await getRegisteredMinerId(stxAddress), i));
    }
  }
  return state;
}
