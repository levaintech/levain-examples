import clsx from 'clsx';
import Link from 'next/link';
import React, { ComponentProps, ReactElement, ReactNode } from 'react';

/**
 * Form Jumbotron is a component that is used to wrap Form Groups.
 * It provides a visual consistency for the form groups.
 * They are non-reactive and can be used for server-side rendered pages that do not require
 * any client-side interactivity.
 *
 * If you need reactivity, wrap your Jumbotron within FormGroup instead.
 * @see FormGroup
 */
export function Jumbotron(props: { children: ReactNode; className?: string }): ReactElement {
  return <div className={clsx('w-full border border-mono-50', props.className)}>{props.children}</div>;
}

export function JumbotronHeader(props: { title: string; children?: ReactNode }): ReactElement {
  const anchor = props.title.toLowerCase().replace(/([^a-zA-Z0-9])/g, '-');
  return (
    <div className="flex items-center border-b border-mono-50 p-5 [&_>]:shrink-0">
      <div className="flex-grow">
        <h3 id={anchor} className="text-xl font-normal text-mono-50">
          {props.title}
        </h3>
      </div>
      {props.children}
    </div>
  );
}

export function JumbotronRow(props: { children?: ReactNode }): ReactElement {
  return <div className="m-5 grid grid-cols-1 gap-5 sm:grid-cols-2">{props?.children}</div>;
}

export function JumbotronRowParagraph(props: {
  children?: ReactNode;
  className?: string;
  span?: undefined | 1 | 2;
}): ReactElement {
  return (
    <p
      className={clsx(
        'text-sm text-mono-400',
        {
          'col-span-2': props.span === 2 || props.span === undefined,
          'col-span-1': props.span === 1,
        },
        props.className,
      )}
    >
      {props.children}
    </p>
  );
}

export function JumbotronRowList(props: { children?: ReactNode; className?: string }): ReactElement {
  return (
    <ul role="list" className={clsx('list-disc space-y-1 pl-5 text-sm text-mono-400', props.className)}>
      {props.children}
    </ul>
  );
}

export function JumbotronRowListItem(props: { children?: ReactNode; className?: string }): ReactElement {
  return <li className={clsx(props.children)}>{props.children}</li>;
}

export function JumbotronFooter(props: { description?: ReactNode | string; children?: ReactNode }): ReactElement {
  return (
    <div className="flex items-center justify-between gap-5 border-t border-t-mono-800 px-5 py-2">
      <p className={clsx('py-1 text-sm leading-snug text-mono-400')}>{props.description}</p>
      {props.children}
    </div>
  );
}

export function JumbotronLink(
  props: ComponentProps<typeof Link> & {
    children: ReactNode;
  },
): ReactElement {
  const { children, className, ...rest } = props;
  return (
    <Link
      {...rest}
      className={clsx(
        'relative block shrink-0 rounded bg-mono-50 px-7 py-3 text-sm font-semibold text-mono-950',
        'before:absolute before:inset-0 before:rounded',
        'hover:before:bg-mono-900/20',
        'focus:before:bg-mono-900/20',
        className,
      )}
    >
      {children}
    </Link>
  );
}
