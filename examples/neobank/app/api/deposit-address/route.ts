import { createSdkClient } from '@/components/RequestSdk';
import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';

export async function POST(req: Request): Promise<Response> {
  const sdkClient = createSdkClient();

  const res = await req.json();

  const label = `Deposit Address #${randomUUID().substring(0, 4)}`;

  try {
    const created = await sdkClient.createWalletDepositAddress({
      walletId: res.walletId,
      label: label,
    });

    return NextResponse.json({ result: created }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ e }, { status: 500 });
  }
}
