import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import CityCoin from '../images/CC_StandAlone.svg';
import MiamiCoin from '../images/MIA_StandAlone.svg';
import MiamiBG from '../images/MIA_BG_Horizontal.svg';
import NewYorkCityCoin from '../images/NYC_StandAlone.svg';
import NewYorkCityBG from '../images/NYC_BG_Horizontal.svg';

/* GENERAL HELPERS AND SETTINGS */

export const CITYCOIN_LOGO = CityCoin;
export const REWARD_CYCLE_LENGTH = (network) => network === "mainnet" ? 2100 : 1050;

// controls menu options and data queries
export const CITY_LIST = ['mia', 'nyc'];
export const CITY_ROUTES = ['Dashboard', 'Activation', 'Mining', 'Stacking', 'Tools'];

// tracks current data and state
export const currentCityAtom = atomWithStorage('currentCity', undefined);
export const currentRouteAtom = atomWithStorage('currentRoute', undefined);
export const currentRewardCycleAtom = atomWithStorage('currentRewardCycle', undefined);
export const userIdAtom = atomWithStorage('userId', undefined);
export const miningStatsAtom = atomWithStorage('miningStats', undefined);
export const stackingStatsAtom = atomWithStorage('stackingStats', undefined);

// stats objects per city for dashboard
export const miningStatsPerCityAtom = atomWithStorage('miningStatsPerCity', {
  mia: undefined,
  nyc: undefined
})

export const stackingStatsPerCityAtom = atomWithStorage('stackingStatsPerCity', {
  mia: undefined,
  nyc: undefined
})

/* COMPILED CITY CONFIGURATION OBJECT */
// general functions used to get contract info
// - city object contains general info
// - city[versions]contains list of available versions
// - city[currentVersion] is the default version
// - versions object contains the config per version
export const miaConfigList = (network) => {
  return {
    city: {
      name: "mia",
      displayName: "Miami",
      logo: "https://cdn.citycoins.co/logos/miamicoin.png",
      versions: Object.keys(miaVersionList),
      currentVersion: "dao-v1",
      activationBlock: 24497,
    },
    versions: miaVersionList(network),
  };
};

export const nycConfigList = (network) => {
  return {
    city: {
      name: "nyc",
      displayName: "Miami",
      logo: "https://cdn.citycoins.co/logos/newyorkcitycoin.png",
      versions: Object.keys(nycVersionList),
      currentVersion: "dao-v1",
      activationBlock: 24497,
    },
    versions: nycVersionList(network),
  };
};

const miaVersionList = (network) => {
  return {
    "legacy-v1": miaLegacyV1(network),
    "legacy-v2": miaLegacyV2(network),
    "dao-v1": miaDaoV1(network),
  };
};

const nycVersionList = (network) => {
  return {
    "legacy-v1": nycLegacyV1(network),
    "legacy-v2": nycLegacyV2(network),
    "dao-v1": nycDaoV1(network),
  };
};

/* SETTINGS PER CODE VERSION */
// network: string "mainnet" | "testnet"
// returns city configuration for a specific version

/* MIAMI */

const miaLegacyV1 = (network) => {
  return {
    enabled: false,
    startAt: 24497,
    endAt: 58917,
    auth: {
      deployer:
        network === "mainnet" ? "SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27" : "",
      contractName: "miamicoin-auth",
    },
    mining: {
      deployer:
        network === "mainnet" ? "SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27" : "",
      contractName: "miamicoin-core-v1",
      miningFunction: "mine-many",
      miningClaimFunction: "claim-mining-reward",
    },
    stacking: {
      deployer:
        network === "mainnet" ? "SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27" : "",
      contractName: "miamicoin-core-v1",
      stackingFunction: "stack-tokens",
      stackingClaimFunction: "claim-stacking-reward",
    },
    token: {
      deployer:
        network === "mainnet" ? "SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27" : "",
      contractName: "miamicoin-token",
      displayName: "MiamiCoin",
      decimals: 0,
      symbol: "MIA",
      tokenName: "miamicoin",
    },
  };
};

const miaLegacyV2 = (network) => {
  return {
    enabled: true,
    startAt: 58921,
    endAt: undefined,
    auth: {
      deployer:
        network === "mainnet"
          ? "SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R"
          : "ST1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8WRH7C6H",
      contractName: "miamicoin-auth-v2",
    },
    mining: {
      deployer:
        network === "mainnet"
          ? "SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R"
          : "ST1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8WRH7C6H",
      contractName: "miamicoin-core-v2",
      miningFunction: "mine-many",
      miningClaimFunction: "claim-mining-reward",
    },
    stacking: {
      deployer:
        network === "mainnet"
          ? "SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R"
          : "ST1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8WRH7C6H",
      contractName: "miamicoin-core-v2",
      stackingFunction: "stack-tokens",
      stackingClaimFunction: "claim-stacking-reward",
    },
    token: {
      deployer:
        network === "mainnet"
          ? "SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R"
          : "ST1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8WRH7C6H",
      contractName: "miamicoin-token-v2",
      displayName: "MiamiCoin",
      decimals: 6,
      symbol: "MIA",
      tokenName: "miamicoin",
    },
  };
};

const miaDaoV1 = (network) => {
  return {
    enabled: true,
    startAt: undefined,
    endAt: undefined,
    auth: {
      deployer:
        network === "mainnet"
          ? "SP1XQXW9JNQ1W4A7PYTN3HCHPEY7SHM6KP98H3NCY"
          : "ST355N8734E5PVX9538H2QGMFP38RE211D9E2B4X5",
      contractName: "ccd001-direct-execute",
    },
    mining: {
      deployer:
        network === "mainnet"
          ? "SP1XQXW9JNQ1W4A7PYTN3HCHPEY7SHM6KP98H3NCY"
          : "ST355N8734E5PVX9538H2QGMFP38RE211D9E2B4X5",
      contractName: "ccd006-city-mining",
      miningFunction: "mine",
      miningClaimFunction: "claim-mining-reward",
    },
    stacking: {
      deployer:
        network === "mainnet"
          ? "SP1XQXW9JNQ1W4A7PYTN3HCHPEY7SHM6KP98H3NCY"
          : "ST355N8734E5PVX9538H2QGMFP38RE211D9E2B4X5",
      contractName: "ccd007-city-stacking",
      stackingFunction: "stack",
      stackingClaimFunction: "claim-stacking-reward",
    },
    token: {
      deployer:
        network === "mainnet"
          ? "SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R"
          : "ST1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8WRH7C6H",
      contractName: "miamicoin-token-v2",
      tokenName: "miamicoin",
      displayName: "MiamiCoin",
      decimals: 6,
      symbol: "MIA",
    },
  };
};

/* NEW YORK CITY */

const nycLegacyV1 = (network) => {
  return {
    enabled: false,
    startAt: 24497,
    endAt: 58917,
    auth: {
      deployer:
        network === "mainnet"
          ? "SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5"
          : "",
      contractName: "newyorkcitycoin-auth",
    },
    mining: {
      deployer:
        network === "mainnet"
          ? "SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5"
          : "",
      contractName: "newyorkcitycoin-core-v1",
      miningFunction: "mine-many",
      miningClaimFunction: "claim-mining-reward",
    },
    stacking: {
      deployer:
        network === "mainnet"
          ? "SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5"
          : "",
      contractName: "newyorkcitycoin-core-v1",
      stackingFunction: "stack-tokens",
      stackingClaimFunction: "claim-stacking-reward",
    },
    token: {
      deployer:
        network === "mainnet"
          ? "SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5"
          : "",
      contractName: "newyorkcitycoin-token",
      displayName: "NewYorkCityCoin",
      decimals: 0,
      symbol: "NYC",
      tokenName: "newyorkcitycoin",
    },
  };
};

const nycLegacyV2 = (network) => {
  return {
    enabled: true,
    startAt: 58921,
    endAt: undefined,
    auth: {
      deployer:
        network === "mainnet"
          ? "SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11"
          : "STSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1D64KKHQ",
      contractName: "newyorkcitycoin-auth-v2",
    },
    mining: {
      deployer:
        network === "mainnet"
          ? "SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11"
          : "STSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1D64KKHQ",
      contractName: "newyorkcitycoin-core-v2",
      miningFunction: "mine-many",
      miningClaimFunction: "claim-mining-reward",
    },
    stacking: {
      deployer:
        network === "mainnet"
          ? "SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11"
          : "STSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1D64KKHQ",
      contractName: "newyorkcitycoin-core-v2",
      stackingFunction: "stack-tokens",
      stackingClaimFunction: "claim-stacking-reward",
    },
    token: {
      deployer:
        network === "mainnet"
          ? "SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11"
          : "STSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1D64KKHQ",
      contractName: "newyorkcitycoin-token-v2",
      displayName: "NewYorkCityCoin",
      decimals: 6,
      symbol: "NYC",
      tokenName: "newyorkcitycoin",
    },
  };
};

const nycDaoV1 = (network) => {
  return {
    enabled: true,
    startAt: undefined,
    endAt: undefined,
    auth: {
      deployer:
        network === "mainnet"
          ? "SP1XQXW9JNQ1W4A7PYTN3HCHPEY7SHM6KP98H3NCY"
          : "ST355N8734E5PVX9538H2QGMFP38RE211D9E2B4X5",
      contractName: "ccd001-direct-execute",
    },
    mining: {
      deployer:
        network === "mainnet"
          ? "SP1XQXW9JNQ1W4A7PYTN3HCHPEY7SHM6KP98H3NCY"
          : "ST355N8734E5PVX9538H2QGMFP38RE211D9E2B4X5",
      contractName: "ccd006-city-mining",
      miningFunction: "mine",
      miningClaimFunction: "claim-mining-reward",
    },
    stacking: {
      deployer:
        network === "mainnet"
          ? "SP1XQXW9JNQ1W4A7PYTN3HCHPEY7SHM6KP98H3NCY"
          : "ST355N8734E5PVX9538H2QGMFP38RE211D9E2B4X5",
      contractName: "ccd007-city-stacking",
      stackingFunction: "stack",
      stackingClaimFunction: "claim-stacking-reward",
    },
    token: {
      deployer:
        network === "mainnet"
          ? "SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11"
          : "STSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1D64KKHQ",
      contractName: "newyorkcitycoin-token-v2",
      displayName: "NewYorkCityCoin",
      decimals: 6,
      symbol: "NYC",
      tokenName: "newyorkcitycoin",
    },
  };
};
