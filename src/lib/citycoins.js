import { callReadOnlyFunction, cvToJSON, standardPrincipalCV } from '@stacks/transactions';
import { NETWORK } from './stacks';

// define constants
export const CITYCOIN_VRF = 'citycoin-vrf';

// function that returns the user ID from the contract
export async function getUserId(contractAddress, contractName, address) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'get-user-id',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}

// function that returns if a user is the block winner
export async function isBlockWinner(contractAddress, contractName, address) {
  const resultCv = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'is-block-winner',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: contractAddress,
  });
  const result = cvToJSON(resultCv);
  console.log(result);
  return result;
}
