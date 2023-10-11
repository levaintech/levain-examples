import { ReactElement } from 'react';
import Link from 'next/link';
import { StyledTable } from '@/components/StyledTable';
import { Wallet } from '@/app/api/wallets/route';
import { endpoint } from '@/app/api/endpoint';

export const dynamic = 'force-dynamic';

export default async function WalletsPage(): Promise<ReactElement> {
  const response = await fetch(endpoint('/wallets'));
  const data: Wallet[] = await response.json();

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
              <th>CAIP-10 Identifier</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((wallet) => (
              <tr key={wallet.walletId}>
                <td>
                  <Link href={`/wallets/${wallet.walletId}`}>{wallet.name}</Link>
                </td>
                <td>{wallet.caip10}</td>
                <td>
                  <Link href="" className="border-mono-50 block border px-4 py-1 font-bold">
                    Send
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </div>
    </main>
  );
}
