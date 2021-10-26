import { StacksMainnet } from '@stacks/network';

export const STACKS_API_URL = 'https://stacks-node-api.mainnet.stacks.co';
export const STACKS_API_WS_URL = 'wss://stacks-node-api.mainnet.stacks.co/';
export const STACKS_API_V2_INFO = `${STACKS_API_URL}/v2/info`;
export const STACKS_API_ACCOUNTS_URL = `${STACKS_API_URL}/v2/accounts`;
export const STACKS_API_FEE_URL = `${STACKS_API_URL}/v2/fees/transfer`;

export const NETWORK = new StacksMainnet();
