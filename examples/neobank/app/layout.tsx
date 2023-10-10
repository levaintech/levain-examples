import './globals.css';
import { ReactElement, ReactNode } from 'react';
import { Metadata } from 'next';
import { ThemeScript, ThemeSelector } from '@/components/ThemeSelector';
import { MadeWithLevain } from '@/components/MadeWithLevain';

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
            <h1 className="text-mono-50 text-3xl font-bold">Levain NeoBank</h1>
            <ThemeSelector />
          </div>
        </div>

        {props.children}

        <MadeWithLevain />
      </body>
    </html>
  );
}
