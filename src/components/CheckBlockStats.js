import { Fragment, useState } from 'react';
import { getMiningStatsAtBlock } from '../lib/citycoin';

export function CheckBlockStats(props) {
  const [amountUstx, setAmountUstx] = useState(0);

  const blockStats = async () => {
    const result = await getMiningStatsAtBlock(props.blockHeight).catch(err =>
      console.log(`blockStats err: ${err}`)
    );
    //console.log(`result: ${JSON.stringify(result)}`);
    result && setAmountUstx(result.value.value.amount.value);
  };

  blockStats();

  return (
    <Fragment key={props.blockHeight}>
      <div className="row border-bottom">
        <div className={`col-2 my-auto`}>{amountUstx ? amountUstx : 'Loading...'}</div>
      </div>
    </Fragment>
  );
}
