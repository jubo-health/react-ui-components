import React from 'react';
import { twMerge } from 'tailwind-merge';

import Textarea from '../Textarea';
import Popover from '../Popover';
import Item from '../Item';

type Option = { value: string; label: string };
type AcceptedOption = string | Option;
export interface AutoTextareaProps<T extends AcceptedOption = string>
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
  defaultOptions: Array<T>;
}

const defaultProps = { size: 'lg' } as AutoTextareaProps;

const AutoTextarea = React.forwardRef(function AutoTextareaInner<
  T extends AcceptedOption = string
>(
  props: AutoTextareaProps<T> & typeof defaultProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  const { size, defaultOptions, ...rest } = props;
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const options: Option[] = React.useMemo(
    () =>
      (defaultOptions || []).map(option =>
        typeof option === 'string'
          ? { value: option, label: option }
          : (option as Option)
      ),
    [defaultOptions]
  );

  return (
    <div
      className='w-fit relative'
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <Textarea
        ref={ref}
        value={value}
        onChange={event => {
          setValue(event.target.value);
        }}
        onFocus={() => {
          setOpen(true);
        }}
      />
      {open && (
        <Popover className='w-full' tabIndex={0}>
          {options.map(option => (
            <Item
              key={option.value}
              className='hover:bg-grey-300'
              onClick={() => {
                setValue(option.value);
              }}
              onMouseDown={e => {
                e.preventDefault();
              }}
            >
              {option.label}
            </Item>
          ))}
        </Popover>
      )}
    </div>
  );
});
AutoTextarea.defaultProps = defaultProps;

export default AutoTextarea;
