import React, { useRef, useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CONTRACT_DEPLOYER, CITYCOIN_CORE, NETWORK } from '../lib/constants';
import { BLOCK_HEIGHT, getStxFees, refreshBlockHeight } from '../lib/blocks';
import { useAtom } from 'jotai';
import { TxStatus } from './TxStatus';
import converter from 'number-to-words';
import {
  AnchorMode,
  bufferCVFromString,
  FungibleConditionCode,
  listCV,
  makeStandardSTXPostCondition,
  noneCV,
  PostConditionMode,
  someCV,
  uintCV,
} from '@stacks/transactions';
import { CurrentBlockHeight } from './CurrentBlockHeight';
import { fetchAccount } from '../lib/account';

export function CityCoinMining({ ownerStxAddress }) {
  const amountRef = useRef();
  const mineManyRef = useRef();
  const memoRef = useRef();
  const sameForAllBlocks = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const [isError, setError] = useState();
  const [errorMsg, setErrorMsg] = useState('');
  const [buttonLabel, setButtonLabel] = useState('Mine');
  const [numberOfBlocks, setNumberOfBlocks] = useState();
  const [blockAmounts, setBlockAmounts] = useState([]);
  const [sameBlockAmounts, setSameBlockAmounts] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [checked, setChecked] = useState(false);
  const [profileState, setProfileState] = useState({
    account: undefined,
  });
  const [blockHeight, setBlockHeight] = useAtom(BLOCK_HEIGHT);
  const { doContractCall } = useConnect();

  useEffect(() => {
    fetchAccount(ownerStxAddress).then(acc => {
      setProfileState({ account: acc });
    });
  }, [ownerStxAddress]);

  const canBeSubmitted = () => {
    return checked ? setIsDisabled(true) : setIsDisabled(false);
  };

  const onCheckboxClick = () => {
    setChecked(!checked);
    return canBeSubmitted();
  };

  const sameCommitAllBlocks = () => {
    setSameBlockAmounts(!sameBlockAmounts);
    var amountForAll = 0;
    for (let i = 0; i < numberOfBlocks; i++) {
      let target = document.getElementById(`miningAmount-${converter.toWords(i + 1)}`);
      if (!sameBlockAmounts) {
        if (i == 0) {
          amountForAll = target.value;
        } else {
          target.value = amountForAll;
          target.disabled = true;
        }
      } else {
        target.disabled = false;
      }
    }
    return sameBlockAmounts;
  };

  useEffect(() => {
    refreshBlockHeight(setBlockHeight);
  }, [setBlockHeight]);

  const mineAction = async () => {
    setLoading(true);
    setError(false);
    setErrorMsg('');
    console.log(`amountRef: ${amountRef.current.value}`);
    if (numberOfBlocks === 1 && !amountRef.current.value) {
      console.log(`${numberOfBlocks} and ${amountRef.current.value}`);
      setLoading(false);
      setError(true);
      setErrorMsg('Please enter an amount to mine for one block.');
    } else if (numberOfBlocks > 200) {
      setLoading(false);
      setError(true);
      setErrorMsg('Cannot submit for more than 200 blocks.');
    } else {
      const estimatedFee = await getStxFees();
      const estimatedFeeUstx = estimatedFee * 1000000;
      const mineMany = numberOfBlocks > 1;

      console.log(`STX Balance: ${profileState.account.balance}`);
      console.log(`estimatedFee: ${estimatedFee}`);
      console.log(`mineMany: ${mineMany}`);

      let amountUstx = 0;
      let amountUstxCV = uintCV(0);
      let memo = '';
      let memoCV = noneCV();
      let sumArray = [];
      let mineManyArray = [];

      if (mineMany) {
        for (let i = 0; i < numberOfBlocks; i++) {
          sumArray.push(parseInt(blockAmounts[i].amount));
        }
        var sum = uintCV(sumArray.reduce((a, b) => a + b, 0) * 1000000);
        for (let i = 0; i < numberOfBlocks; i++) {
          mineManyArray.push(uintCV(blockAmounts[i].amount * 1000000));
        }
        mineManyArray = listCV(mineManyArray);
      } else {
        amountUstx = Math.floor(parseFloat(amountRef.current.value.trim()) * 1000000);
        amountUstxCV = uintCV(amountUstx);
        memo = memoRef.current.value.trim();
        memoCV = memo ? someCV(bufferCVFromString(memo)) : noneCV();
      }

      let totalSubmitted = 0;

      mineMany ? (totalSubmitted = sum.value) : (totalSubmitted = amountUstx);

      console.log(`total submitted ${totalSubmitted}`);

      // check there is enough left for fees
      if (totalSubmitted >= profileState.account.balance - estimatedFeeUstx) {
        setLoading(false);
        setError(true);
        setErrorMsg(
          `Not enough funds to cover estimated transaction fee of ${estimatedFee} STX. Total Submitted: ${
            totalSubmitted / 1000000
          } STX, Estimated Fee ${estimatedFee} STX, Total Balance: ${
            profileState.account.balance / 1000000
          } STX`
        );
      } else {
        try {
          await doContractCall({
            contractAddress: CONTRACT_DEPLOYER,
            contractName: CITYCOIN_CORE,
            functionName: mineMany ? 'mine-many' : 'mine-tokens',
            functionArgs: mineMany ? [mineManyArray] : [amountUstxCV, memoCV],
            postConditionMode: PostConditionMode.Deny,
            postConditions: [
              makeStandardSTXPostCondition(
                ownerStxAddress,
                FungibleConditionCode.Equal,
                mineMany ? sum.value : amountUstxCV.value
              ),
            ],
            anchorMode: AnchorMode.OnChainOnly,
            network: NETWORK,
            onCancel: () => {
              setLoading(false);
            },
            onFinish: result => {
              setLoading(false);
              setError(false);
              setErrorMsg('');
              setTxId(result.txId);
            },
          });
        } catch (e) {
          setLoading(false);
          setError(true);
          setErrorMsg(JSON.stringify(e));
        }
      }
    }
  };

  const updateValue = numberOfBlocks => {
    if (numberOfBlocks > 1) {
      for (let i = 1; i < (numberOfBlocks + 1) / 10; i++) {
        setBlockAmounts(currentBlock => [
          ...currentBlock,
          {
            num: i,
            amount: blockAmounts.amount,
          },
        ]);
      }
    } else {
      setButtonLabel('Mine');
    }
  };

  return (
    <>
      <h3>Mine CityCoins</h3>
      <CurrentBlockHeight />
      <p>
        Mining CityCoins is done by spending STX in a given Stacks block. A winner is selected
        randomly weighted by the miners' proportion of contributions of that block. Rewards can be
        withdrawn after a 100 block maturity window.
      </p>
      <form>
        <div className="form-floating">
          <input
            className="form-control"
            placeholder="Number of Blocks to Mine?"
            ref={mineManyRef}
            onChange={event => {
              setNumberOfBlocks(event.target.value);
              setBlockAmounts([]);
              updateValue(event.target.value);
            }}
            value={numberOfBlocks}
            id="mineMany"
          />
          <label htmlFor="mineMany">Number of Blocks to Mine?</label>
        </div>
        {numberOfBlocks > 1 && (
          <div className="form-check my-3">
            <input
              className="form-check-input"
              type="checkbox"
              ref={sameForAllBlocks}
              value=""
              id="sameForAllBlocks"
              onClick={sameCommitAllBlocks}
            />
            <label className="form-check-label" htmlFor="sameForAllBlocks">
              Mine same amount for every block?
            </label>
          </div>
        )}
        <br />
        <div className={`input-group mb-3 ${numberOfBlocks != 1 ? 'd-none' : ''}`}>
          <input
            type="number"
            className="form-control"
            ref={amountRef}
            aria-label="Amount in STX"
            placeholder="Amount in STX"
            title="Amount to spend bidding for this single block."
            required
            minLength="1"
          />
          <div className="input-group-append">
            <span className="input-group-text">STX</span>
          </div>
        </div>
        <input
          ref={memoRef}
          className={`form-control ${numberOfBlocks != 1 ? 'd-none' : ''}`}
          type="text"
          placeholder="Memo (optional)"
          aria-label="Optional memo field"
          maxLength="34"
        />
        <div className="input-group">
          {blockAmounts.map(b => {
            return (
              <div className="m-3" key={b.num}>
                <label className="form-label" htmlFor={`miningAmount-${converter.toWords(b.num)}`}>
                  Block Commit {b.num}
                </label>
                <input
                  className="form-control"
                  id={`miningAmount-${converter.toWords(b.num)}`}
                  onChange={e => {
                    const amount = e.target.value;
                    setBlockAmounts(currentBlock =>
                      currentBlock.map(x =>
                        x.num === b.num
                          ? {
                              ...x,
                              amount,
                            }
                          : x
                      )
                    );
                    var sumArray = [];
                    for (let i = 0; i < numberOfBlocks; i++) {
                      sumArray.push(parseInt(blockAmounts[i].amount));
                    }
                    sumArray = sumArray.filter(function (value) {
                      return !Number.isNaN(value);
                    });
                    setButtonLabel(`Mine for ${numberOfBlocks} blocks`);
                  }}
                  value={b.amount}
                  placeholder="STX Amount"
                />
              </div>
            );
          })}
        </div>
        <br />
        <button
          className="btn btn-block btn-primary mb-3"
          type="button"
          disabled={isDisabled}
          onClick={mineAction}
        >
          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top ms-1 me-2`}
          />
          {buttonLabel}
        </button>
        <div className={`alert alert-danger ${isError ? '' : 'd-none'}`}>{errorMsg}</div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
            onClick={onCheckboxClick}
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            I confirm that by participating in mining, I understand:
            <ul>
              <li>
                the City of Miami has not yet officially claimed the MiamiCoin protocol contribution
              </li>
              <li>
                participation does not guarantee winning the rights to claim newly minted $MIA
              </li>
              <li>once STX are sent to the contract, it is one way, and they are not returned</li>
            </ul>
          </label>
        </div>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
