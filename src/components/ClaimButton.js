import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CORE, CONTRACT_DEPLOYER, NETWORK } from '../lib/constants';
import { uintCV } from '@stacks/transactions';

export function ClaimButton({ blockHeight }) {
  const { doContractCall } = useConnect();

  console.log(`block height in ClaimButton: ${blockHeight}`);

  const claimAtHeight = async blockHeight => {
    //  const { doContractCall } = useConnect();
    await doContractCall({
      contractAddress: CONTRACT_DEPLOYER,
      contractName: CITYCOIN_CORE,
      functionName: 'claim-mining-reward',
      functionArgs: [uintCV(blockHeight)],
      network: NETWORK,
      onCancel: () => {
        console.log('canceled');
      },
      onFinish: result => {
        console.log(`finished: ${result.txId}`);
      },
    });
  };

  return (
    <>
      <button
        className="btn btn-block btn-primary my-3"
        type="button"
        onClick={claimAtHeight(blockHeight)}
      >
        Claim
      </button>
    </>
  );
}
