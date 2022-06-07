import { CHAIN_SUFFIX, STACKS_EXPLORER } from '../../lib/stacks';

export default function LinkTx({ txId, shorten = true }) {
  !txId.startsWith('0x') && (txId = `0x${txId}`);
  const url = `${STACKS_EXPLORER}/txid/${txId}`;
  return (
    <a href={`${url}${CHAIN_SUFFIX}`} target="_blank" rel="noreferrer">
      {shorten ? txId.substring(0, 5) + '...' + txId.substring(txId.length - 5) : txId}
      <i className="bi bi-box-arrow-up-right ms-1" />
    </a>
  );
}
