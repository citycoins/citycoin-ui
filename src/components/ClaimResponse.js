import { callReadOnlyFunction, cvToJSON, standardPrincipalCV, uintCV } from '@stacks/transactions';
import { ClaimButton } from './ClaimButton';

export async function ClaimResponse(ownerStxAddress, blockHeight) {
  return <div>hello</div>;
}

/*
await callReadOnlyFunction({
    contractAddress: CONTRACT_DEPLOYER,
    contractName: CITYCOIN_CORE,
    functionName: 'is-block-winner',
    functionArgs: [standardPrincipalCV(ownerStxAddress), uintCV(blockHeight)],
    network: NETWORK,
    senderAddress: CONTRACT_DEPLOYER,
  }).then(winner => {
    const isWinner = cvToJSON(winner).value;
    return(<div class="row px-3 align-items-center}">
    <div class="col-2 fw-bold ${isWinner ? 'text-success' : ''}">
      ${i}
    </div>
    <div class="col-2">
      ${isWinner ? <ClaimButton blockHeight={i} /> : 'nope'}
    </div>
  </div>)
  }
  */
