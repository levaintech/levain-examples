import { ReactElement } from 'react';
import { LevainLogo } from '@/components/LevainLogo';
import Link from 'next/link';

export function MadeWithLevain(): ReactElement {
  return (
    <div className="fixed bottom-4 right-4">
      <Link
        href="https://levain.tech"
        target="_blank"
        className="border-mono-800 hover:bg-invert/2.5 flex items-center gap-1.5 rounded border px-2.5 py-1.5"
      >
        <LevainLogo className="h-3.5 w-3.5 fill-current" />
        <div className="text-mono-300 text-xs font-bold">Build with Levain</div>
      </Link>
    </div>
  );
}
