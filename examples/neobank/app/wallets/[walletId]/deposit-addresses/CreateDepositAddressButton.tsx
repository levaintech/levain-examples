'use client';

import { ReactElement, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function CreateDepositAddressButton(props: { walletId: string }): ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateAddress = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await fetch('/api/deposit-address', {
        method: 'POST',
        body: JSON.stringify({
          walletId: props.walletId,
        }),
      });
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  return (
    <button
      disabled={isLoading}
      className="hover:cursor-pointere border-mono-50 group inline-flex items-center justify-center border px-5 py-3 font-bold disabled:cursor-progress"
      onClick={handleCreateAddress}
    >
      <span className="opacity-100 group-disabled:opacity-0">Create Deposit Address</span>
      <LoadingSpinner className="absolute h-5 w-5 opacity-0 group-disabled:opacity-100" />
    </button>
  );
}
