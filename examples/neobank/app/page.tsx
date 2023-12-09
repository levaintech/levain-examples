import { ReactElement } from 'react';
import Link from 'next/link';
import { StyledTable } from '@/components/StyledTable';

import { createGraphClient } from '@/components/RequestGraph';
import { JumbotronHeader } from '@/components/Jumbotron';

export default async function WalletPage(): Promise<ReactElement> {
  const graphClient = createGraphClient();

  const response: any = await graphClient.request(`
    query WalletQuery {
      organization(orgId: ${process.env.ORGANIZATION_ID!}) {
        name
        orgId
        wallets {
          totalCount
          edges {
            node {
              name
              mainAddress
              walletId
              organizationNetwork {
                network {
                  identifier
                }
              }
            }
          }
        }
      }
    }
  `);

  const org = response.organization;

  return (
    <main className="mx-auto my-6 w-full max-w-screen-xl px-6 lg:my-10 lg:px-10">
      <div className="border border-mono-50">
        <div className="flex flex-wrap items-center justify-between p-5">
          <div className="text-xl">Omnibus Wallets</div>
        </div>
        <StyledTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blockchain CAIP2 Identifier</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {org.wallets.edges.map((edge: any) => {
              const node = edge.node;
              return (
                <>
                  <tr id={node.mainAddress}>
                    <td>{node.name}</td>
                    <td>{node.organizationNetwork.network.identifier}</td>
                    <td>{node.mainAddress}</td>
                    <td>
                      <div className="flex">
                        <Link
                          href={`/wallets/${node.walletId}`}
                          className="block border border-mono-50 px-4 py-1 font-bold"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </StyledTable>
        <div className="border-t border-mono-50 px-5 py-2.5 text-sm">
          Total Records: {response.organization.wallets.totalCount}
        </div>
      </div>
    </main>
  );
}
