import { ReactElement } from 'react';
import { ThemeSelector } from '@/components/ThemeSelector';
import { ActiveLink } from '@/components/ActiveLink';

export function RootHeader(): ReactElement {
  const links = [
    {
      href: '/',
      label: 'Wallet Overview',
    },
    {
      href: '/transactions',
      label: 'Transactions',
    },
  ];

  return (
    <div className="mx-auto my-6 w-full max-w-screen-xl px-6 lg:my-10 lg:px-10">
      <div className="flex justify-between">
        <h1 className="text-mono-50 text-3xl font-bold">Levain Wallet</h1>
        <ThemeSelector />
      </div>
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
    </div>
  );
}
