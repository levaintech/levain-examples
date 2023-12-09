import React, { ReactElement } from 'react';
import { Jumbotron, JumbotronHeader, JumbotronRow } from '@/components/Jumbotron';
import { createGraphClient } from '@/components/RequestGraph';
import bignumber from 'bignumber.js';
import clsx from 'clsx';
import { StyledTable } from '@/components/StyledTable';
export default async function WalletOverviewPage(props: {
  params: {
    walletId: string;
  };
}): Promise<ReactElement> {
  const graphClient = createGraphClient();

  const response: any = await graphClient.request(`
    query WalletOverviewQuery {
      wallet(walletId: "${props.params.walletId}") {
        name
        mainAddress
        status
        description
        organizationNetwork{
          network {
            protocolName
            identifier
          }
        }
         balances {
          items {
            symbol
            name
            balanceBase
            caip19Id
            decimals
          }
        }
      }
    }
`);

  const wallet = response.wallet;

  return (
    <div className="mt-16 flex flex-wrap justify-center">
      <div className="w-2/3">
        <Jumbotron>
          <JumbotronHeader title={`${wallet.name}`} />
          <JumbotronRow>
            <WalletDetail label="Wallet ID" value={props.params.walletId} />
            <WalletDetail label="Status" value={wallet.status} />
          </JumbotronRow>
          <JumbotronRow />
          <JumbotronRow>
            <WalletDetail label="Address" value={wallet.mainAddress} />
          </JumbotronRow>
          <JumbotronRow>
            <WalletDetail label="Network" value={wallet.organizationNetwork.network.protocolName} />
            <WalletDetail label="CAIP-2 Identifier" value={wallet.organizationNetwork.network.identifier} />
          </JumbotronRow>
        </Jumbotron>
        <div className="mb-20 mt-5 border border-mono-50">
          <div className="flex flex-wrap items-center justify-between p-5">
            <div className="text-xl">Balances</div>
          </div>
          <StyledTable>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Balance</th>
              </tr>
            </thead>

            <tbody>
              {wallet.balances.items.map((item: any) => {
                const value = bignumber(item.balanceBase).div(bignumber(10).pow(item.decimals));

                return (
                  <>
                    <tr id={item.caip19Id}>
                      <td>{item.symbol}</td>
                      <td>
                        {value.toFixed(6)} {item.symbol}
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </StyledTable>
        </div>
      </div>
    </div>
  );
}

function WalletDetail(props: { label: string; value: string }): ReactElement {
  return (
    <div className="block select-none text-sm text-mono-400">
      {props.label}
      <div
        className={clsx(
          'mt-3 w-full rounded border-none bg-invert/5 px-4 py-3 text-sm text-mono-50',
          'focus:ring-1 focus:ring-mono-50',
          'aria-invalid:ring-1 aria-invalid:ring-red-500',
          'disabled:text-mono-500',
        )}
      >
        {props.value}
      </div>
    </div>
  );
}
