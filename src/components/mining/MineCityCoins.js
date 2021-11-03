import { useEffect, useRef, useState } from 'react';
import converter from 'number-to-words';
import { getEstimatedStxFee, getMempoolFeeAvg, getMempoolFeeMedian } from '../../lib/stacks';
import { userSessionState } from '../../lib/auth';
import { MineTokens } from '../../lib/citycoins';
import { useAtom } from 'jotai';
import { useStxAddresses } from '../../lib/hooks';
import { fetchAccount } from '../../lib/account';
import { listCV, uintCV } from '@stacks/transactions';

export default function MineCityCoins(props) {
  const amountRef = useRef();
  const mineManyRef = useRef();
  const memoRef = useRef();
  const sameAmountForAllRef = useRef();

  const [userSession] = useAtom(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);
  const [profileState, setProfileState] = useState({
    account: undefined,
  });

  const [numberOfBlocks, setNumberOfBlocks] = useState();
  const [blockAmounts, setBlockAmounts] = useState([]);
  const [buttonLabel, setButtonLabel] = useState('Mine');

  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState();
  const [isError, setError] = useState();
  const [errorMsg, setErrorMsg] = useState('');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (ownerStxAddress) {
      fetchAccount(ownerStxAddress).then(acc => {
        setProfileState({ account: acc });
      });
    }
  }, [ownerStxAddress]);

  const updateValue = numberOfBlocks => {
    setError(false);
    setErrorMsg('');
    if (numberOfBlocks > 1) {
      for (let i = 1; i < numberOfBlocks + 1; i++) {
        setBlockAmounts(currentBlock => [
          ...currentBlock,
          {
            num: i,
            amount: blockAmounts.amount,
          },
        ]);
      }
      setButtonLabel(`Mine for ${numberOfBlocks} blocks`);
    } else {
      if (numberOfBlocks > 0 && !isNaN(numberOfBlocks)) {
        setButtonLabel(`Mine for ${numberOfBlocks} block`);
      } else {
        setButtonLabel('Mine');
        setError(true);
        setErrorMsg('Please enter a valid number');
      }
    }
  };

  const canBeSubmitted = () => {
    return checked ? setIsDisabled(true) : setIsDisabled(false);
  };

  const onCheckboxClick = () => {
    setChecked(!checked);
    return canBeSubmitted();
  };

  const mineAction = async () => {
    setLoading(true);
    setError(false);
    setErrorMsg('');
    console.log(`amountRef: ${amountRef.current.value}`);
    if (numberOfBlocks === 1 && !amountRef.current.value) {
      console.log(`${numberOfBlocks} and ${amountRef.current.value}`);
      setLoading(false);
      setError(true);
      setErrorMsg('Please enter a valid amount to mine for one block.');
    } else if (numberOfBlocks > 200) {
      setLoading(false);
      setError(true);
      setErrorMsg('Cannot submit for more than 200 blocks.');
    } else {
      const estimatedFees = await getEstimatedStxFee(); // 1 STX
      const mempoolFeeAvg = await getMempoolFeeAvg(); // ustx
      const mempoolFeeMedian = await getMempoolFeeMedian(); // ustx
      console.log(`attempting to mine.`);
      console.log(`estimatedFees: ${estimatedFees}`);
      console.log(`mempoolFeeAvg: ${mempoolFeeAvg}`);
      console.log(`mempoolFeeMedian: ${mempoolFeeMedian}`);
      console.log(`STX Address: ${ownerStxAddress}`);
      console.log(`STX Balance: ${profileState.account.balance}`);
      const mineMany = numberOfBlocks > 1;
      let amountUstx = 0;
      let memo = '';
      let mineManyArray = [];
      let sum = 0;

      if (mineMany) {
        console.log(`mine-many`);
        let amount;
        for (let i = 0; i < numberOfBlocks; i++) {
          amount = Math.floor(parseFloat(blockAmounts[i].amount) * 1000000);
          mineManyArray.push(uintCV(amount));
          sum += amount;
        }
        mineManyArray = listCV(mineManyArray);
        console.log(`sum: ${sum}`);
      } else {
        console.log(`mine-single`);
        amountUstx = Math.floor(parseFloat(amountRef.current.value.trim()) * 1000000);
        memo = memoRef.current.value.trim();
        console.log(`amount: ${amountUstx}`);
        console.log(`memo: ${memo}`);
        MineTokens(
          props.contracts.deployer,
          props.contracts.coreContract,
          ownerStxAddress,
          amountUstx,
          memo ? memo : undefined
        );
      }
      let totalSubmitted = 0;
      mineMany ? (totalSubmitted = sum) : (totalSubmitted = amountUstx);
      console.log(`total submitted ${totalSubmitted}`);
    }
  };

  return (
    <div className="container-fluid p-6">
      <h3>
        Mine {props.token.symbol}{' '}
        <a
          className="primary-link"
          target="_blank"
          rel="noreferrer"
          href="https://docs.citycoins.co/citycoins-core-protocol/mining-citycoins"
        >
          <i className="bi bi-question-circle"></i>
        </a>
      </h3>
      <p>
        Mining {props.token.text} is done by competing with other miners in a Stacks block. You can
        only mine once per block.
      </p>
      <p>
        One winner is selected randomly, weighted by how much the miner commits against the total
        committed that block.
      </p>
      <p></p>
      <p>
        The winner for a block can be queried after 100 blocks pass (~16-17hrs), and the winner can
        claim newly minted {props.token.symbol}.
      </p>
      <form>
        <div className="form-floating">
          <input
            className="form-control"
            placeholder="Number of Blocks to Mine?"
            ref={mineManyRef}
            onChange={event => {
              setNumberOfBlocks(parseInt(event.target.value.trim()));
              setBlockAmounts([]);
              updateValue(parseInt(event.target.value.trim()));
            }}
            value={numberOfBlocks}
            type="number"
            id="mineMany"
          />
          <label htmlFor="mineMany">Number of Blocks to Mine?</label>
        </div>
        <br />
        <div className="input-group mb-3" hidden={numberOfBlocks !== 1}>
          <input
            type="number"
            className="form-control"
            ref={amountRef}
            aria-label="Amount in STX"
            placeholder="Amount in STX"
            required
            minLength="1"
          />
          <div className="input-group-append">
            <span className="input-group-text">STX</span>
          </div>
        </div>
        <input
          ref={memoRef}
          className="form-control"
          type="text"
          placeholder="Memo (optional)"
          aria-label="Optional memo field"
          maxLength="34"
          hidden={numberOfBlocks !== 1}
        />
        <div className="form-check mb-3" hidden={isNaN(numberOfBlocks) || numberOfBlocks === 1}>
          <input
            ref={sameAmountForAllRef}
            className="form-check-input"
            type="checkbox"
            value=""
            id="sameAmountForAll"
          />
          <label className="form-check-label" htmlFor="sameAmountForAll">
            Use same amount for all blocks?
          </label>
        </div>
        <div className="input-group">
          <div className="row g-2 w-100">
            {blockAmounts.map(b => {
              return (
                <div className="col-md-2 form-floating" key={b.num}>
                  <input
                    className="form-control"
                    id={`miningAmount-${converter.toWords(b.num)}`}
                    onChange={e => {
                      const amount = e.target.value;
                      setBlockAmounts(currentBlock =>
                        currentBlock.map(x =>
                          x.num === b.num || sameAmountForAllRef.current.checked
                            ? {
                                ...x,
                                amount,
                              }
                            : x
                        )
                      );
                    }}
                    value={b.amount}
                  />
                  <label htmlFor={`miningAmount-${converter.toWords(b.num)}`}>Block {b.num}</label>
                </div>
              );
            })}
          </div>
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
                participation does not guarantee winning the rights to claim newly minted $MIA
              </li>
              <li>once STX are sent to the contract, they are not returned</li>
            </ul>
          </label>
        </div>
      </form>
    </div>
  );
}
