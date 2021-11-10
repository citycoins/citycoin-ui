import { Fragment, useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { getIsBlockWinner } from '../lib/citycoin';
import { CITYCOIN_CORE, CONTRACT_DEPLOYER, NETWORK } from '../lib/constants';
import { uintCV } from '@stacks/transactions';

export function CheckBlockWinner(props) {
  const [loading, setLoading] = useState(true);
  const [isWinner, setIsWinner] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [txId, setTxId] = useState();
  const [nonce, setNonce] = useState();
  const { doContractCall } = useConnect();

  useEffect(() => {
    getIsBlockWinner(props.ownerStxAddress, props.blockHeight).then(result => {
      if (result !== undefined) {
        setLoading(false);
        setIsWinner(result);
      }
    });
  }, [props.blockHeight, props.ownerStxAddress]);

  const claimAction = async () => {
    await doContractCall({
      contractAddress: CONTRACT_DEPLOYER,
      contractName: CITYCOIN_CORE,
      functionName: 'claim-mining-reward',
      functionArgs: [uintCV(props.blockHeight)],
      network: NETWORK,
      onFinish: result => {
        setTxId(result.txId);
        console.log(`nonce: ${result.stacksTransaction.auth.spendingCondition.nonce.toNumber()}`);
        setNonce(result.stacksTransaction.auth.spendingCondition.nonce.toNumber());
        setIsDisabled(true);
      },
    });
  };

  return (
    <Fragment key={props.blockHeight}>
      <div className="row border-bottom">
        <div className={`col-2 my-auto ${isWinner ? 'text-success fw-bold' : ''}`}>
          {props.blockHeight}
        </div>
        <div className={`col-2 my-auto ${isWinner ? 'text-success fw-bold' : ''}`}>
          {loading ? 'Loading...' : isWinner ? 'Yes!' : 'No'}
        </div>
        {isWinner ? (
          <div className="col-2">
            <button
              className="btn btn-sm btn-block btn-primary"
              type="button"
              onClick={claimAction}
              disabled={isDisabled}
            >
              Claim {props.blockHeight}
            </button>
          </div>
        ) : null}
        {txId && (
          <>
            <div className="col-2 my-auto">Nonce {nonce}</div>
            <div className="col-2 my-auto">0x{txId}</div>
          </>
        )}
      </div>
    </Fragment>
  );
}
