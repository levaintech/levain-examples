import { redirect } from 'next/navigation';

export function GET(): Promise<Response> {
  return redirect('/wallets');
}
