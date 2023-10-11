import { ReactElement } from 'react';
import Link from 'next/link';
import { StyledTable } from '@/components/StyledTable';

export default function WalletPage(): ReactElement {
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
            <tr>
              <td>Wallet #1</td>
              <td>caip2:eip155:421613</td>
              <td>0xd54c050540bb15c7be6e16d8f65dbd42a890414e2b6a0b96b7312a5bbcb8ae94</td>
              <td>
                <div className="flex">
                  <Link href="" className="border-mono-50 block border px-4 py-1 font-bold">
                    Send
                  </Link>
                </div>
              </td>
            </tr>
            <tr>
              <td>Wallet #1</td>
              <td>caip2:eip155:421613</td>
              <td>0xd54c050540bb15c7be6e16d8f65dbd42a890414e2b6a0b96b7312a5bbcb8ae94</td>
              <td>
                <div className="flex">
                  <Link href="" className="border-mono-50 block border px-4 py-1 font-bold">
                    Send
                  </Link>
                </div>
              </td>
            </tr>
          </tbody>
        </StyledTable>
        <div className="border-mono-50 border-t px-5 py-2.5 text-sm">Total Records:</div>
      </div>
    </main>
  );
}
