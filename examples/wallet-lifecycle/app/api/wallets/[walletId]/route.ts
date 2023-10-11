export async function GET(
  request: Request,
  { params: { walletId } }: { params: { walletId: string } },
): Promise<Response> {
  return Response.json({
    walletId,
    name: 'Wallet #1',
    caip10: 'caip2:eip155:1/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    assets: [
      {
        caip19: 'caip19:eip155:1/erc20:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'wETH',
        balance: '13370000000000000000', // 13.37 wETH
        balanceUsd: '21279.56',
        decimals: 18,
      },
      {
        caip19: 'caip19:eip155:1/slip44:60',
        symbol: 'ETH',
        balance: '13370000000000000000', // 13.37 ETH
        balanceUsd: '21279.56',
        decimals: 18,
      },
    ],
  } as WalletDetails);
}

export interface WalletDetails {
  walletId: string;
  name: string;
  caip10: string;
  assets: {
    symbol: string;
    decimals: number;
    balance: string;
    balanceUsd: string;
    caip19: string;
  }[];
}
