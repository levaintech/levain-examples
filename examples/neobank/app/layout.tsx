import './globals.css';
import { ReactElement, ReactNode } from 'react';
import { Metadata } from 'next';
import { ThemeScript } from '@/components/ThemeSelector';
import { MadeWithLevain } from '@/components/MadeWithLevain';
import { RootHeader } from '@/app/RootHeader';

export const metadata: Metadata = {
  title: 'NeoBank — Levain Examples',
  description: 'A banking app built with Levain, Next.js and Tailwind CSS.',
};

export default function RootLayout(props: { children: ReactNode }): ReactElement {
  return (
    <html lang="en">
      <head>
        <ThemeScript />
      </head>
      <body className="bg-mono-950 text-mono-200">
        <RootHeader />
        {props.children}
        <MadeWithLevain />
      </body>
    </html>
  );
}
