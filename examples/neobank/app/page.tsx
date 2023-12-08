import { ReactElement } from 'react';
import Link from 'next/link';
import { StyledTable } from '@/components/StyledTable';

import { createGraphClient } from '@/components/RequestGraph';

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
      <div className="border-mono-50 border">
        <div className="p-5">
          <h2>Omnibus Wallets</h2>
        </div>
        <StyledTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blockchain CAIP2 Identifier</th>
              <th>Link to Scan</th>
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
                        <Link href="" className="border-mono-50 block border px-4 py-1 font-bold">
                          Send
                        </Link>
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </StyledTable>
        <div className="border-mono-50 border-t px-5 py-2.5 text-sm">
          Total Records: {response.organization.wallets.totalCount}
        </div>
      </div>
    </main>
  );
}
