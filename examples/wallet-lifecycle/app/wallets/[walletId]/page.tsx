import { ReactElement } from 'react';
import { WalletDetails } from '@/app/api/wallets/[walletId]/route';
import { endpoint } from '@/app/api/endpoint';

export default async function WalletPage({
  params: { walletId },
}: {
  params: { walletId: string };
}): Promise<ReactElement> {
  const wallet: WalletDetails = await fetch(endpoint(`/wallets/${walletId}`), { cache: 'no-cache' }).then((response) =>
    response.json(),
  );

  return (
    <div className="max-w-xl pt-2">
      <h2 className="text-mono-50 py-4 text-2xl font-bold">{wallet.name}</h2>
      <div className="flex items-center justify-between p-2">
        <span className="text-mono-200 text-sm font-bold">Wallet ID</span>
        <span className="text-mono-50 text-sm">{wallet.walletId}</span>
      </div>
      <div className="flex items-center justify-between p-2">
        <span className="text-mono-200 text-sm font-bold">CAIP-10 URI</span>
        <span className="text-mono-50 text-sm">{wallet.caip10}</span>
      </div>
      <h2 className="text-mono-50 py-4 text-2xl font-bold">Assets</h2>
      {wallet.assets.map((asset) => (
        <div className="flex items-center justify-between p-2">
          <span className="text-mono-200 text-sm font-bold">{asset.symbol}</span>
          <span className="text-mono-50 text-sm">
            {Number(asset.balance) / 10 ** asset.decimals} ({asset.balanceUsd} USD)
          </span>
        </div>
      ))}
    </div>
  );
}
