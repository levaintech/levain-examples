import clsx from 'clsx';
import { ReactElement, SVGProps } from 'react';

export function LoadingSpinner(props: SVGProps<any>): ReactElement {
  const { className, ...attributes } = props;
  return (
    <svg viewBox="0 0 24 24" className={clsx('animate-spin fill-current', className)} {...attributes}>
      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
