import { connectWebSocketClient } from '@stacks/blockchain-api-client';
import React, { useState, useEffect, useRef } from 'react';
import { chainSuffix, STACKS_API_WS_URL, transactionsApi } from '../lib/constants';

export function TxStatus({ txId, resultPrefix }) {
  const [processingResult, setProcessingResult] = useState({ loading: false });
  const spinner = useRef();

  useEffect(() => {
    if (!txId) {
      return;
    }
    console.log(txId);
    setProcessingResult({ loading: true });

    let sub;
    const subscribe = async (txId, update) => {
      try {
        const client = await connectWebSocketClient(STACKS_API_WS_URL);
        sub = await client.subscribeTxUpdates(txId, update);
        console.log({ client, sub });
      } catch (e) {
        console.log(e);
      }
    };

    subscribe(txId, async event => {
      console.log(event);
      let result;
      if (event.tx_status === 'pending') {
        return;
      } else if (event.tx_status === 'success') {
        const tx = await transactionsApi.getTransactionById({ txId });
        console.log(tx);
        result = tx.tx_result;
      } else if (event.tx_status.startsWith('abort')) {
        result = undefined;
      }
      setProcessingResult({ loading: false, result });
      await sub.unsubscribe();
    });
  }, [txId]);

  if (!txId) {
    return null;
  }

  const normalizedTxId = txId.startsWith('0x') ? txId : `0x${txId}`;
  return (
    <>
      {processingResult.loading && (
        <>
          <p>TXID:</p>
          <p>{normalizedTxId}</p>
        </>
      )}
    </>
  );
}
