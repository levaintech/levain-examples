import { ReactElement } from 'react';
import Link from 'next/link';
import { StyledTable } from '@/components/StyledTable';

import { createGraphClient } from '@/components/RequestGraph';
import { createSdkClient } from '@/components/RequestSdk';
import { useRouter } from 'next/navigation';
import CreateDepositAddressButton from '@/app/wallets/[walletId]/deposit-addresses/CreateDepositAddressButton';

export default async function WalletPage(props: {
  params: {
    walletId: string;
  };
}): Promise<ReactElement> {
  const graphClient = createGraphClient();

  const response: any = await graphClient.request(`
    query WalletDepositAddressQuery {
      wallet(walletId: "${props.params.walletId}") {
        name
        depositAddresses {
          totalCount
          edges{
            node {
              label
              address
              status
            }
          }
        }
      }
    }
`);

  const wallet = response.wallet;

  return (
    <main className="mx-auto my-6 w-full max-w-screen-xl px-6 lg:my-10 lg:px-10">
      <div className="border-mono-50 border">
        <div className="flex flex-wrap items-center justify-between p-5">
          <div className="text-xl">Deposit Addresses</div>
          <CreateDepositAddressButton walletId={props.params.walletId} />
        </div>
        <StyledTable>
          <thead>
            <tr>
              <th>Label</th>
              <th>Address</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {wallet.depositAddresses.edges.map((edge: any) => {
              const node = edge.node;
              return (
                <>
                  <tr id={node.address}>
                    <td>{node.label}</td>
                    <td>{node.address}</td>
                    <td>{node.status}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </StyledTable>
        <div className="border-mono-50 border-t px-5 py-2.5 text-sm">
          Total Records: {wallet.depositAddresses.totalCount}
        </div>
      </div>
    </main>
  );
}
