import { getUserData } from '@stacks/connect-react';
import { addressToString } from '@stacks/transactions';

import { useState, useEffect } from 'react';
import { getStacksAccount } from './account';
import { mocknet, testnet } from './constants';

export function useStxAddresses(userSession) {
  const [ownerStxAddress, setOwnerStxAddress] = useState();
  const [appStxAddress, setAppStxAddress] = useState();
  const authenticated = userSession && userSession.isUserSignedIn();
  useEffect(() => {
    try {
      if (authenticated && userSession) {
        getUserData(userSession)
          .then(userData => {
            const { address } = getStacksAccount(userData.appPrivateKey);
            setAppStxAddress(addressToString(address));
            setOwnerStxAddress(
              userData.profile.stxAddress['testnet']
            );
          })
          .catch(e => {
            console.log(e);
          });
      }
    } catch (e) {
      console.log(e);
    }
  }, [userSession, authenticated]);

  return { ownerStxAddress, appStxAddress };
}
