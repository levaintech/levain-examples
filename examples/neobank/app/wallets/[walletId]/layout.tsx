import { ReactElement, ReactNode } from 'react';
import { ActiveLink } from '@/components/ActiveLink';

export default function WalletLayout(props: {
  children: ReactNode;
  params: {
    walletId: string;
  };
}): ReactElement {
  const links = [
    {
      href: `/wallets/${props.params.walletId}`,
      label: 'Wallet Overview',
    },
    {
      href: `/wallets/${props.params.walletId}/deposit-addresses`,
      label: 'Deposit Addresses',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-10">
      <div className="border-b-mono-800 mt-5 flex gap-4 border-b">
        {links.map((link) => (
          <ActiveLink
            key={link.href}
            href={link.href}
            className="text-mono-500 block px-2 pb-2.5 pt-3 text-sm font-bold"
            activeClassName="!text-mono-50 border-b-2 border-b-mono-50"
          >
            {link.label}
          </ActiveLink>
        ))}
      </div>
      {props.children}
    </div>
  );
}
