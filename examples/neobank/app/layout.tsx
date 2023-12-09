import './globals.css';
import { ReactElement, ReactNode } from 'react';
import { Metadata } from 'next';
import { ThemeScript, ThemeSelector } from '@/components/ThemeSelector';
import { MadeWithLevain } from '@/components/MadeWithLevain';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NeoBank — Levain Examples',
  description:
    'A neo-banking app built with Levain, Next.js and Tailwind CSS. Start, run and grow your crypto business with enterprise-grade security and self-custody wallet infrastructure.',
};

export default function RootLayout(props: { children: ReactNode }): ReactElement {
  return (
    <html lang="en">
      <head>
        <ThemeScript />
      </head>
      <body className="bg-mono-950 text-mono-200">
        <div className="mx-auto mt-6 w-full max-w-screen-xl px-6 lg:mt-10 lg:px-10">
          <div className="flex justify-between">
            <Link href="/">
              <h1 className="text-3xl font-bold text-mono-50">Levain NeoBank</h1>
            </Link>
            <ThemeSelector />
          </div>
        </div>

        {props.children}

        <MadeWithLevain />
      </body>
    </html>
  );
}
