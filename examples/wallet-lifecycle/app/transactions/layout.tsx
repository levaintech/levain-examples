import { ReactElement, ReactNode } from 'react';

export default function TransactionsLayout(props: { children: ReactNode }): ReactElement {
  return <div className="mx-auto my-6 w-full max-w-screen-xl px-6 lg:my-10 lg:px-10">{props.children}</div>;
}
