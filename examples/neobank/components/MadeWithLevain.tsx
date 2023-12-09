import { ReactElement } from 'react';
import { LevainLogo } from '@/components/LevainLogo';
import Link from 'next/link';

export function MadeWithLevain(): ReactElement {
  return (
    <div className="fixed bottom-4 right-4">
      <Link
        href="https://levain.tech"
        target="_blank"
        className="flex items-center gap-1.5 rounded border border-mono-800 px-2.5 py-1.5 hover:bg-invert/2.5"
      >
        <LevainLogo className="h-3.5 w-3.5 fill-current" />
        <div className="text-xs font-bold text-mono-300">Build with Levain</div>
      </Link>
    </div>
  );
}
