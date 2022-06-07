import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { stxAddressAtom, stxBnsNameAtom } from '../../store/stacks';

export function Address() {
  const [stxAddress] = useAtom(stxAddressAtom);
  const [bnsName] = useAtom(stxBnsNameAtom);
  const displayAddress = useMemo(() => {
    if (bnsName.loaded) return bnsName.data;
    if (stxAddress.loaded)
      return `${stxAddress.data.substring(0, 5)}...${stxAddress.data.substring(
        stxAddress.data.length - 5
      )}`;
    return 'Profile';
  }, [stxAddress, bnsName]);

  return <span title={displayAddress}>{displayAddress}</span>;
}
