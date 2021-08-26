import React, { useState, useEffect } from 'react';
import { fetchAccount } from '../lib/account';
import { Address } from './Address';
import { Amount } from './Amount';
import { refreshPrice, STX_USD } from '../lib/price';
import { useAtom } from 'jotai';
import {} from 'react-jdenticon';
import { CurrentBlockHeight } from './CurrentBlockHeight';
import { CurrentRewardCycle } from './CurrentRewardCycle';

export function ProfileFull({ stxAddress, userSession }) {
  const [profileState, setProfileState] = useState({
    account: undefined,
  });

  const [stxUsd, setStxUsd] = useAtom(STX_USD);

  useEffect(() => {
    refreshPrice(setStxUsd);
  }, [setStxUsd]);

  useEffect(() => {
    fetchAccount(stxAddress).then(acc => {
      setProfileState({ account: acc });
    });
  }, [stxAddress]);

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="offcanvasProfile"
      aria-labelledby="offcanvasProfileLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasProfileLabel">
          <a className="navbar-brand" href="/">
            {stxAddress || typeof stxAddress != 'undefined' ? (
              <svg
                className="rounded-circle bg-white"
                width="50"
                height="50"
                data-jdenticon-value={stxAddress}
              />
            ) : (
              <img src="/stacks.png" width="50" height="50" alt="Logo" />
            )}
          </a>
          {stxAddress ? <Address addr={stxAddress} /> : 'Profile'}{' '}
        </h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <div className="dropdown mt-3">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
          >
            Actions
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <a
                className="dropdown-item"
                href={'https://explorer.stacks.co/address/' + stxAddress}
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-box-arrow-up-right"></i> View Address on Explorer
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="https://github.com/citycoins/citycoin-ui/issues/new?assignees=&labels=Bug&template=bug_report.md&title=%F0%9F%90%9E%5BBUG%5D+"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-bug"></i> Report a Bug
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="https://github.com/citycoins/citycoin-ui/issues/new?assignees=&labels=Enhancement&template=feature_request.md&title=%E2%9A%A1%5BFEAT%5D+"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-lightning"></i> Request a Feature
              </a>
            </li>
            <li>
              <button
                className="dropdown-item"
                href="#"
                onClick={() => {
                  userSession.signUserOut('/');
                }}
              >
                <i className="bi bi-x-circle"></i> Sign Out
              </button>
            </li>
          </ul>
          <hr />
          {profileState.account && (
            <>
              <h5 className="mb-3">Account Balances</h5>
              <Amount ustx={profileState.account.balance} stxAddress={stxAddress} />
            </>
          )}
          <hr />
          <CurrentBlockHeight />
          <CurrentRewardCycle />
        </div>
      </div>{' '}
    </div>
  );
}

/*
LAST 5 TX CODE
<hr />
              <h5>Last 5 Transactions</h5>
              <div className="accordion accordion-flush" id="accordionLastFiveTx">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseOne"
                    >
                      <i className="bi bi-circle me-2 text-warning"></i>claim-token-reward
                    </button>
                  </h2>
                  <div
                    id="flush-collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionLastFiveTx"
                  >
                    <div className="accordion-body">
                      <span title="ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A">
                        By: ST3CK...HK60A
                      </span>
                      <br />
                      Status: Pending
                      <br />
                      TX ID:
                      <a
                        className="ps-1"
                        href="https://explorer.stacks.co/txid/0x3415d7c2bba593b1c209757cfceec0756f68ec99be21706fed318be9eb5309bc?chain=testnet"
                        target="_blank"
                        rel="noreferrer"
                        title="View on Explorer"
                      >
                        0x3415d7c2...
                      </a>
                      <a className="link-dark ps-1" href="#" title="Copy to Clipboard">
                        <i className="bi bi-clipboard"></i>
                      </a>
                      <br />
                      Block: TBD
                      <br />
                      Date: TBD
                      <br />
                      Time: TBD
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseTwo"
                      aria-expanded="false"
                      aria-controls="flush-collapseTwo"
                    >
                      <i className="bi bi-circle me-2 text-danger"></i>mine-tokens
                    </button>
                  </h2>
                  <div
                    id="flush-collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingTwo"
                    data-bs-parent="#accordionLastFiveTx"
                  >
                    <div className="accordion-body">
                      <span title="ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A">
                        By: ST3CK...HK60A
                      </span>
                      <br />
                      Status: Failed
                      <br />
                      TX ID:
                      <a
                        className="ps-1"
                        href="https://explorer.stacks.co/txid/0x8afc854d9c20976b65ae519a66d58bfe210fa22f7690a381b3dfc0e2c0f262b2?chain=testnet"
                        target="_blank"
                        rel="noreferrer"
                        title="View on Explorer"
                      >
                        0x8afc854d...
                      </a>
                      <a className="link-dark ps-1" href="#" title="Copy to Clipboard">
                        <i className="bi bi-clipboard"></i>
                      </a>
                      <br />
                      Block: 14725
                      <br />
                      Date: 2021/06/09
                      <br />
                      Time: 04:39:56 PM
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseThree"
                      aria-expanded="false"
                      aria-controls="flush-collapseThree"
                    >
                      <i className="bi bi-circle me-2 text-success"></i>stack-tokens
                    </button>
                  </h2>
                  <div
                    id="flush-collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingThree"
                    data-bs-parent="#accordionLastFiveTx"
                  >
                    <div className="accordion-body">
                      <span title="ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A">
                        By: ST3CK...HK60A
                      </span>
                      <br />
                      Status: Success
                      <br />
                      TX ID:
                      <a
                        className="ps-1"
                        href="https://explorer.stacks.co/txid/0xca95e7402780c6cb0671be1f4fcd9daf2737775cd5399cc6d39abf2912a070a5?chain=testnet"
                        target="_blank"
                        rel="noreferrer"
                        title="View on Explorer"
                      >
                        0xca95e740...
                      </a>
                      <a className="link-dark ps-1" href="#" title="Copy to Clipboard">
                        <i className="bi bi-clipboard"></i>
                      </a>
                      <br />
                      Block: 15425
                      <br />
                      Date: 2021/06/15
                      <br />
                      Time: 01:16:41 PM
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingFour">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseFour"
                      aria-expanded="false"
                      aria-controls="flush-collapseFour"
                    >
                      <i className="bi bi-circle me-2 text-success"></i>stack-tokens
                    </button>
                  </h2>
                  <div
                    id="flush-collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingFour"
                    data-bs-parent="#accordionLastFiveTx"
                  >
                    <div className="accordion-body">
                      <span title="ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A">
                        By: ST3CK...HK60A
                      </span>
                      <br />
                      Status: Success
                      <br />
                      TX ID:
                      <a
                        className="ps-1"
                        href="https://explorer.stacks.co/txid/0xca95e7402780c6cb0671be1f4fcd9daf2737775cd5399cc6d39abf2912a070a5?chain=testnet"
                        target="_blank"
                        rel="noreferrer"
                        title="View on Explorer"
                      >
                        0xca95e740...
                      </a>
                      <a className="link-dark ps-1" href="#" title="Copy to Clipboard">
                        <i className="bi bi-clipboard"></i>
                      </a>
                      <br />
                      Block: 15425
                      <br />
                      Date: 2021/06/15
                      <br />
                      Time: 01:16:41 PM
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingFive">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseFive"
                      aria-expanded="false"
                      aria-controls="flush-collapseFive"
                    >
                      <i className="bi bi-circle me-2 text-success"></i>stack-tokens
                    </button>
                  </h2>
                  <div
                    id="flush-collapseFive"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingFive"
                    data-bs-parent="#accordionLastFiveTx"
                  >
                    <div className="accordion-body">
                      <span title="ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A">
                        By: ST3CK...HK60A
                      </span>
                      <br />
                      Status: Success
                      <br />
                      TX ID:
                      <a
                        className="ps-1"
                        href="https://explorer.stacks.co/txid/0xca95e7402780c6cb0671be1f4fcd9daf2737775cd5399cc6d39abf2912a070a5?chain=testnet"
                        target="_blank"
                        rel="noreferrer"
                        title="View on Explorer"
                      >
                        0xca95e740...
                      </a>
                      <a className="link-dark ps-1" href="#" title="Copy to Clipboard">
                        <i className="bi bi-clipboard"></i>
                      </a>
                      <br />
                      Block: 15425
                      <br />
                      Date: 2021/06/15
                      <br />
                      Time: 01:16:41 PM
                    </div>
                  </div>
                </div>
              </div>
*/
