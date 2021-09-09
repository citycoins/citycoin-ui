import React, { useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CONTRACT_DEPLOYER, CITYCOIN_CORE, NETWORK } from '../lib/constants';
import { uintCV, callReadOnlyFunction, cvToJSON, standardPrincipalCV } from '@stacks/transactions';
import { CurrentBlockHeight } from './CurrentBlockHeight';
import { TxStatus } from './TxStatus';
import { getIsBlockWinner, getMiningStatsAtBlock } from '../lib/citycoin';
import { ClaimButton } from './ClaimButton';
import { ClaimResponse } from './ClaimResponse';

export function CityCoinMiningClaim({ ownerStxAddress }) {
  const [loading, setLoading] = useState();
  const [canClaim, setCanClaim] = useState(false);
  const [txId, setTxId] = useState();
  const { doContractCall } = useConnect();
  const blockHeightToCheck = useRef();
  const startCheckHeight = useRef();
  const endCheckHeight = useRef();
  const claimCheckHeight = useRef();
  // const [winnerTable, setWinnerTable] = useState([]);
  const blockHeightResponse = document.getElementById('blockHeightResponse');

  const canClaimRewards = claimValue => {
    return claimValue ? setCanClaim(true) : setCanClaim(false);
  };

  const claimAction = async () => {
    setLoading(true);
    await doContractCall({
      contractAddress: CONTRACT_DEPLOYER,
      contractName: CITYCOIN_CORE,
      functionName: 'claim-mining-reward',
      functionArgs: [uintCV(claimCheckHeight.current.value)],
      network: NETWORK,
      onCancel: () => {
        setLoading(false);
      },
      onFinish: result => {
        setLoading(false);
        setTxId(result.txId);
      },
    });
  };

  const checkStats = async () => {
    // read-only call for get-mining-stats-at-block
    console.log('checkStats called');
    blockHeightResponse.innerHTML = 'Loading...';
    let bigResponse = '';

    for (let i = startCheckHeight.current.value; i <= endCheckHeight.current.value; i++) {
      console.log(`loop index: ${i}`);
      blockHeightResponse.innerHTML = `Loading Stats: ${i} out of ${endCheckHeight.current.value}`;
      await getMiningStatsAtBlock(i).then(stats => {
        const totalAmountUstx = stats.value.value.amount.value;
        console.log(`total: ${totalAmountUstx}`);
        bigResponse =
          bigResponse +
          `
        <div class="row border-bottom">
          <div class="col-2">
            ${totalAmountUstx}
          </div>
        </div>`;
      });
    }

    blockHeightResponse.innerHTML = bigResponse;
  };

  const checkWinner = async () => {
    // read-only call for is-block-winner
    blockHeightResponse.innerHTML = 'Loading...';
    let blockHeightsToCheck = [];
    let bigResponse = '';

    for (let i = startCheckHeight.current.value; i <= endCheckHeight.current.value; i++) {
      blockHeightResponse.innerHTML = `Loading Winners: ${i} out of ${endCheckHeight.current.value}`;
      blockHeightsToCheck.push(parseInt(i));
      await getIsBlockWinner(ownerStxAddress, parseInt(i)).then(result => {
        console.log(`block: ${i} result: ${result}`);
        bigResponse += `<div class="row border-bottom">
        <div class="col-2 ${result ? 'bg-light text-success fw-bold' : ''}">${i}</div>
        <div class="col-2 ${result ? 'bg-light text-success fw-bold' : ''}">${result}</div>
        </div>`;
        blockHeightResponse.innerHTML = bigResponse;
      });
    }
  };
  return (
    <>
      <h3 className="mt-6">Claim Mining Rewards</h3>
      <div>
        <div className="form-floating">
          <input
            className="form-control"
            placeholder="Claim Height?"
            type="number"
            id="startCheckHeight"
            ref={claimCheckHeight}
          />
          <label htmlFor="blockHeightToCheck">Claim Height?</label>
        </div>
        <button className="btn btn-block btn-primary my-3 me-3" type="button" onClick={claimAction}>
          Claim Rewards
        </button>
      </div>
      {txId && <TxStatus txId={txId} />}
      <hr />
      <h3>Check Stats/Wins</h3>
      <CurrentBlockHeight />
      <div className="mb-3 row">
        <div className="col">
          <div className="form-floating">
            <input
              className="form-control"
              placeholder="Start Height?"
              type="number"
              id="startCheckHeight"
              ref={startCheckHeight}
            />
            <label htmlFor="blockHeightToCheck">Start Height?</label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating">
            <input
              className="form-control"
              placeholder="End Height?"
              type="number"
              id="endCheckHeight"
              ref={endCheckHeight}
            />
            <label htmlFor="blockHeightToCheck">End Height?</label>
          </div>
        </div>
        <div className="col-12">
          <button
            className="btn btn-block btn-primary my-3 me-3"
            type="button"
            onClick={checkStats}
          >
            Get Mining Stats
          </button>
          <button
            className="btn btn-block btn-primary my-3 me-3"
            type="button"
            onClick={checkWinner}
          >
            Check if Winner
          </button>
        </div>
        <div id="blockHeightResponse"></div>
      </div>
    </>
  );
}
