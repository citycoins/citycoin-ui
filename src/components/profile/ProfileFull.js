import { useAtom } from 'jotai';
import { Address } from './Address';
import { NetworkIndicatorIcon } from './NetworkIndicatorIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import { useConnect } from '../../lib/auth';
import { fromMicro, isTestnet, TESTNET_FAUCET_URL } from '../../lib/stacks';
import { loginStatusAtom, stxAddressAtom, userBalancesAtom } from '../../store/stacks';
import { userIdAtom } from '../../store/cities';
import CityCoinBalance from './CityCoinBalance';
import StxBalance from './StxBalance';
import CityCoinUserIds from './CityCoinUserIds';

export function ProfileFull() {
  const [loginStatus] = useAtom(loginStatusAtom);
  const [stxAddress] = useAtom(stxAddressAtom);
  const [balances] = useAtom(userBalancesAtom);
  const [userIds] = useAtom(userIdAtom);
  const { handleSignOut } = useConnect();

  if (loginStatus) {
    return (
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasProfile"
        aria-labelledby="offcanvasProfileLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasProfileLabel">
            <NetworkIndicatorIcon />
            <Address />
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body text-start">
          <div className="btn-group w-100" role="group" aria-label="Account control buttons">
            <a
              href={`https://explorer.stacks.co/address/${stxAddress.data}`}
              rel="noreferrer"
              target="_blank"
              className="btn btn-outline-primary"
              title="View Address on Explorer"
            >
              <i className="bi bi-box-arrow-up-right"></i>
            </a>
            {isTestnet && (
              <a
                rel="noreferrer"
                href={TESTNET_FAUCET_URL}
                target="_blank"
                className="btn btn-outline-primary"
                title="STX Testnet Faucet"
              >
                <i className="bi bi-box-arrow-up-right" />
              </a>
            )}
            <a
              href="https://github.com/citycoins/ui/issues/new?assignees=&labels=Bug&template=bug_report.md&title=%F0%9F%90%9E%5BBUG%5D+"
              rel="noreferrer"
              target="_blank"
              className="btn btn-outline-primary"
              title="Report a Bug"
            >
              <i className="bi bi-bug"></i>
            </a>
            <a
              href="https://github.com/citycoins/ui/issues/new?assignees=&labels=Enhancement&template=feature_request.md&title=%E2%9A%A1%5BFEAT%5D+"
              rel="noreferrer"
              target="_blank"
              className="btn btn-outline-primary"
              title="Request a Feature"
            >
              <i className="bi bi-lightning"></i>
            </a>
            <button
              className="btn btn-outline-primary"
              href="#"
              title="Sign Out"
              onClick={handleSignOut}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
          <h4 className="text-center mt-3">Account Balances</h4>
          {balances.loaded ? (
            Object.keys(balances.data).map(symbol => {
              return typeof balances.data[symbol] === 'object' ? (
                Object.keys(balances.data[symbol]).map(version => {
                  return balances.data[symbol][version] > 0 ? (
                    <CityCoinBalance
                      key={`${symbol}-${version}-container`}
                      balances={balances}
                      symbol={symbol}
                      version={version}
                    />
                  ) : null;
                })
              ) : (
                <StxBalance
                  key={`${symbol}-container`}
                  balance={fromMicro(balances.data[symbol]).toLocaleString()}
                  symbol={symbol}
                />
              );
            })
          ) : (
            <LoadingSpinner text="Loading balances..." />
          )}
          <hr className="cc-divider" />
          <h4 className="text-center mt-3">CityCoin User IDs</h4>
          {userIds.loaded ? (
            Object.keys(userIds.data).map(city => {
              return Object.keys(userIds.data[city]).map(version => {
                return (
                  <CityCoinUserIds
                    key={`${city}-${version}-container`}
                    userId={
                      userIds.data[city][version]
                        ? userIds.data[city][version].toLocaleString()
                        : 'None'
                    }
                    city={city}
                    version={version}
                  />
                );
              });
            })
          ) : (
            <LoadingSpinner text="Loading user IDs..." />
          )}
        </div>
      </div>
    );
  }
  return null;
}
