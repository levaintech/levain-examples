import { ReactElement, ReactNode } from 'react';
import { clsx } from 'clsx';

/**
 * StyledTable is a wrapper around the HTML table element that adds some styling
 * to child elements.
 */
export function StyledTable(props: { children: ReactNode[] }): ReactElement {
  return (
    <div className="overflow-x-auto">
      <table
        className={clsx(
          'min-w-full',
          'text-mono-400 whitespace-nowrap text-left text-sm lg:whitespace-normal',
          '[&_tr_:is(th)]:text-mono-50 [&_tr_:is(td)]:font-normal [&_tr_:is(th)]:font-bold',
          '[&_tr_:is(th,td)]:py-3',
          '[&_tr_:is(th,td)]:px-5',
          '[&_thead]:border-mono-50 [&_thead]:border-y',
          '[&_tbody]:divide-mono-800 [&_tbody]:divide-y',
        )}
      >
        {props.children}
      </table>
    </div>
  );
}
