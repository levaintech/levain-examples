import clsx from 'clsx';
import { DetailedHTMLProps, InputHTMLAttributes, ReactElement } from 'react';

/**
 * Input "boxes" component, this is a component that looks like several input boxes
 * but is actually just a single input with "boxes" superimposed on top of it.
 * This is highly performant and accessible without the need for ref/focus forwarding.
 *
 * @param props.value The value of the input.
 * @param props.onChange The change handler for the input.
 * @param props.maxLength The maximum length of the input.
 * @param [props.view=InputBoxesView] override the view of the input boxes.
 * @constructor
 */
export function InputBoxes(
  props: Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'className' | 'maxLength' | 'value'
  > & {
    maxLength: number;
    value?: string;
    view?: (props: { maxLength: number; value?: string }) => ReactElement;
  },
): ReactElement {
  const { maxLength, value, view, ...rest } = props;
  const InputBoxes = view ?? InputBoxesView;

  return (
    <div className="group relative w-full">
      <div className="select-none">
        <InputBoxes maxLength={props.maxLength} value={props.value} />
      </div>

      <div className="absolute inset-0 z-10 -mx-6 -my-4">
        <input
          autoComplete="one-time-code"
          className="h-full w-full !appearance-none !border-none !bg-transparent p-0 !text-transparent !caret-transparent !opacity-0 !outline-none !ring-0"
          maxLength={maxLength}
          value={value}
          {...rest}
        />
      </div>
    </div>
  );
}

function InputBoxesView(props: { maxLength: number; value?: string }): ReactElement {
  const length = props.value?.length ?? 0;
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: props.maxLength }).map((_, i) => (
        <div key={i} className={clsx('box-border h-[3.25rem] w-full')}>
          <div
            className={clsx(
              'bg-invert/5 text-mono-50 flex h-full w-full items-center justify-center rounded text-lg font-semibold',
              {
                'group-focus-within:border-mono-50 group-focus-within:border':
                  i === length || (i === length - 1 && props.maxLength === length),
              },
            )}
          >
            {props.value?.[i]}
          </div>
        </div>
      ))}
    </div>
  );
}
