import './globals.css';
import { ReactElement, ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NeoBank — Levain Examples',
  description: 'A banking app built with Levain, Next.js and Tailwind CSS.',
};

export default function RootLayout(props: {
  children: ReactNode
}): ReactElement {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}
