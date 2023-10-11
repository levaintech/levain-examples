export async function GET(): Promise<Response> {
  return Response.json([
    {
      walletId: '00000000-0000-0000-0000-000000000001',
      name: 'Wallet #1',
      caip10: 'caip2:eip155:1/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    },
    {
      walletId: '00000000-0000-0000-0000-000000000002',
      name: 'Wallet #2',
      caip10: 'caip2:eip155:1/0x4b2B9Bb0770a6e3cd682650Ef7A924910b546573',
    },
  ]);
}

export interface Wallet {
  walletId: string;
  name: string;
  caip10: string;
}
