import React, { ReactElement } from 'react';
import { Jumbotron, JumbotronHeader, JumbotronRow } from '@/components/Jumbotron';
import { createGraphClient } from '@/components/RequestGraph';
import { FormGroupField } from '@/components/forms/FormGroup';
import { Field } from 'formik';
import clsx from 'clsx';

export default async function WalletOverviewPage(props: {
  params: {
    walletId: string;
  };
}): ReactElement {
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
        depositAddresses {
          totalCount
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
          <JumbotronRow />
          <JumbotronRow>
            <WalletDetail label="No. of Deposit Addresses" value={wallet.depositAddresses.totalCount} />
          </JumbotronRow>
        </Jumbotron>
      </div>
    </div>
  );
}

function WalletDetail(props: { label: string; value: string }): ReactElement {
  return (
    <div className="text-mono-400 block select-none text-sm">
      {props.label}
      <div
        className={clsx(
          'bg-invert/5 text-mono-50 mt-3 w-full rounded border-none px-4 py-3 text-sm',
          'focus:ring-mono-50 focus:ring-1',
          'aria-invalid:ring-1 aria-invalid:ring-red-500',
          'disabled:text-mono-500',
        )}
      >
        {props.value}
      </div>
    </div>
  );
}
