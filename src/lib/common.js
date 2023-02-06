import throttledQueue from 'throttled-queue';

// flags to enable console logging from all functions
const ENABLE_LOGS = false;

// helper to simplify consistent logging
export const debugLog = msg => ENABLE_LOGS && console.log(msg);

// at most 4 requests per second
const throttle = throttledQueue(4, 1000, true);

// async timer
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// fetch and return JSON from URL
export const fetchJson = async url => {
  debugLog(`fetchJson: ${url}`);
  const response = await throttle(() => fetch(url));
  if (response.status === 200) {
    const json = await response.json();
    debugLog(`fetchJson: ${JSON.stringify(json)}`);
    return json;
  }
  throw new Error(`fetchJson: ${url} ${response.status} ${response.statusText}`);
};

// fix for isNaN not being reliable
export function isStringAllDigits(value) {
  return value.toString().match(/^[0-9]+$/g) !== null;
}

// INCOMPLETE
// helper to create a dynamically nested object
// credit: https://gist.github.com/brianswisher/2ce1ffe3ec08634f78aacd1b7baa31f9
// modified and didn't work first time around but pattern in
// setRewardCyclesToClaim() is a good reference/test
export const createNestedObject = (keys, data) => {
  const result = {};

  const lastIndex = keys.length - 1;

  keys.reduce((nestedObject, currentValue, index) => {
    const isLastIndex = index === lastIndex;
    console.log(`index: ${index} lastIndex: ${lastIndex} isLastIndex: ${isLastIndex}`);
    const value = isLastIndex ? nestedObject[currentValue] : data;
    return (nestedObject[currentValue] = value);
  }, result);

  return result;
};
