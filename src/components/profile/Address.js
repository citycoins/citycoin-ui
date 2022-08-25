import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { stxAddressAtom, stxBnsNameAtom } from '../../store/stacks';
import { truncateAddress } from '@stacks-os/utils';

export function Address() {
  const [stxAddress] = useAtom(stxAddressAtom);
  const [bnsName] = useAtom(stxBnsNameAtom);
  const displayAddress = useMemo(() => {
    if (bnsName.loaded) return bnsName.data;
    if (stxAddress.loaded) return `${truncateAddress(stxAddress.data)}`;
    return 'Profile';
  }, [stxAddress, bnsName]);

  return <span title={displayAddress}>{displayAddress}</span>;
}
