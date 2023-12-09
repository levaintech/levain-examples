'use client';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import clsx from 'clsx';
import { Field, Form, Formik, FormikValues, useField, useFormikContext } from 'formik';
import React, {
  ButtonHTMLAttributes,
  ComponentProps,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  useCallback,
} from 'react';
import { InputBoxes } from '@/components/forms/InputBoxes';

export interface FormGroupSubmitStatus {
  success?: string | { title: string; message?: string };
  error?: string | { title: string; message?: string };
}

export function FormGroup<Values extends FormikValues = FormikValues>(
  props: Omit<ComponentProps<typeof Formik<Values>>, 'onSubmit'> & {
    className?: string;
    children: ReactNode;
    onSubmit: (values: Values) => Promise<FormGroupSubmitStatus | void> | void;
  },
): ReactElement {
  const { className, children, ...formikProps } = props;

  return (
    <Formik
      validateOnChange={true}
      validateOnMount={false}
      validateOnBlur={true}
      {...formikProps}
      enableReinitialize
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        try {
          const status = await props.onSubmit(values);
          if (status === undefined) {
            return;
          }
          actions.setStatus(status);
        } finally {
          actions.setSubmitting(false);
        }
      }}
    >
      <Form className={className}>{children}</Form>
    </Formik>
  );
}

/**
 * A simple helper utility to debug formik context
 * by printing out the formik context.
 */
export function FormGroupDebugger(): ReactElement {
  const formikContext = useFormikContext();
  return (
    <div className="m-5 rounded bg-invert/5 p-3 text-xs">
      <pre>{JSON.stringify(formikContext, null, 2)}</pre>
    </div>
  );
}

/**
 * Show all from group errors
 */
export function FormGroupErrors(props: { className?: string }): ReactElement {
  const formikContext = useFormikContext();
  return (
    <div className={clsx('m-5', props.className)}>
      {Object.values(formikContext.errors).map((v: any, i) => {
        return (
          <p className="text-sm text-red-500" key={i}>
            {v}
          </p>
        );
      })}
    </div>
  );
}

export function FormGroupButton(
  props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    validateDirty?: boolean;
  },
): ReactElement {
  const formikContext = useFormikContext();
  const { validateDirty = true, children, className, ...attributes } = props;

  return (
    <button
      type="submit"
      role="button"
      data-submitting={formikContext.isSubmitting}
      data-valid={formikContext.isValid}
      data-submit-count={formikContext.submitCount}
      disabled={!formikContext.isValid || (validateDirty && !formikContext.dirty) || formikContext.isSubmitting}
      className={clsx(
        'relative shrink-0 bg-mono-50 px-7 py-3 text-sm font-semibold text-mono-950',
        'disabled:cursor-not-allowed disabled:opacity-30',
        'before:absolute before:inset-0',
        'hover:before:bg-mono-900/20',
        'focus:before:bg-mono-900/20',
        'data-[submitting=true]:disabled:cursor-progress data-[submitting=true]:disabled:opacity-50',
        className,
      )}
      {...attributes}
    >
      <div className="[[data-submitting=true]_&]:opacity-0">{children}</div>
      <div className="absolute inset-0 hidden items-center justify-center [[data-submitting=true]_&]:flex">
        <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin fill-current">
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    </button>
  );
}

export function FormGroupField(
  props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    label?: ReactNode | string;
    name: string;
    autocomplete?: string;
    fieldClassName?: string;
  },
): ReactElement {
  const [, meta] = useField(props.name);
  const { label, name, className, fieldClassName, ...attributes } = props;

  return (
    <div className={className}>
      <label className="block select-none text-sm text-mono-400">
        {label}
        <Field
          name={name}
          aria-invalid={!!(meta.error && meta.touched)}
          className={clsx(
            'mt-3 w-full rounded border-none bg-invert/5 px-4 py-3 text-sm text-mono-50',
            'focus:ring-1 focus:ring-mono-50',
            'aria-invalid:ring-1 aria-invalid:ring-red-500',
            'disabled:text-mono-500',
            fieldClassName,
          )}
          {...attributes}
        />
      </label>
      {meta.error && meta.touched && <p className="mt-3 text-sm text-red-500">{meta.error}</p>}
    </div>
  );
}

export function FormGroupInputBoxes(
  props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    label?: ReactNode | string;
    maxLength?: number;
    name: string;
  },
): ReactElement {
  const [field, meta] = useField(props.name);
  const { label, name, className, ...attributes } = props;

  return (
    <div className={className}>
      <label className="block select-none text-sm text-mono-400">
        {label}
        <InputBoxes
          maxLength={props.maxLength ?? 6}
          name={name}
          value={field.value}
          onChange={field.onChange}
          aria-invalid={!!(meta.error && meta.touched)}
          {...attributes}
          autoComplete="off"
        />
      </label>
      {meta.error && meta.touched && <p className="mt-3 text-sm text-red-500">{meta.error}</p>}
    </div>
  );
}

export function FormGroupFieldCheckbox(
  props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    type: 'checkbox';
    label: ReactNode | string;
    name: string;
  },
): ReactElement {
  const [field, meta] = useField(props.name);
  const { label, name, className, ...attributes } = props;

  return (
    <div className={clsx('text-sm text-mono-400', className)}>
      <label className="flex cursor-pointer select-none items-center gap-2.5">
        <Field name={name} aria-invalid={!!meta.error} className="absolute opacity-0" {...attributes} />
        <CheckIcon
          data-value={field.value}
          data-disabled={attributes.disabled}
          className={clsx(
            'box-border h-5 w-5 shrink-0 rounded border border-mono-400 stroke-current stroke-[3px] p-[2px] text-transparent',
            'data-[value=true]:border-mono-50 data-[value=true]:bg-mono-50 data-[value=true]:text-mono-800',
            'data-[disabled=true]:opacity-30',
          )}
        />
        {label}
      </label>
      {meta.error && <p className="mt-3 text-sm text-red-500">{meta.error}</p>}
    </div>
  );
}

export function FormGroupFieldSelect(
  props: DetailedHTMLProps<InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> & {
    label: ReactNode | string;
    name: string;
  },
): ReactElement {
  const { label, name, className, children, ...attributes } = props;
  const [, meta] = useField(name);

  return (
    <div className={className}>
      <label className="block select-none text-sm text-mono-400">
        {label}
        <Field
          as="select"
          name={name}
          aria-invalid={!!(meta.error && meta.touched)}
          className={clsx(
            'mt-3 w-full rounded border-none bg-invert/5 px-4 py-3 text-sm text-mono-50 placeholder:text-mono-500',
            'focus:ring-1 focus:ring-mono-50',
            'aria-invalid:ring-1 aria-invalid:ring-red-500',
          )}
          {...attributes}
        >
          {children}
        </Field>
      </label>
      {meta.error && meta.touched && <p className="mt-3 text-sm text-red-500">{meta.error}</p>}
    </div>
  );
}
