import React from 'react';

import TextInput from '../TextInput';

const AddIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width='24'
    height='24'
    viewBox='-5 -5 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z'
    />
  </svg>
);

const SubstractIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width='24'
    height='24'
    viewBox='-5 -11 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M13 2H1C0.45 2 0 1.55 0 1C0 0.45 0.45 0 1 0H13C13.55 0 14 0.45 14 1C14 1.55 13.55 2 13 2Z'
    />
  </svg>
);
export interface NumberInputProps
  extends React.ComponentProps<typeof TextInput> {
  step?: number;
}
const defaultProps = { step: 1 };

const NumberInput = React.forwardRef<
  HTMLInputElement,
  NumberInputProps & typeof defaultProps
>((props, ref) => {
  const { endAdornment, step, ...rest } = props;
  const [value, setValue] = React.useState<string | number>('');

  const handleChange = React.useCallback(e => {
    setValue(e.currentTarget.value);
  }, []);
  const handleAdd = React.useCallback(() => {
    setValue(prev => +(prev || 0) + step);
  }, [step]);
  const handleSubstract = React.useCallback(() => {
    setValue(prev => +(prev || 0) - step);
  }, [step]);

  return (
    <TextInput
      ref={ref}
      value={value}
      onChange={handleChange}
      type='number'
      endAdornment={
        <>
          {endAdornment}
          <button
            type='button'
            className='rounded-full hover:bg-grey-200 mx-2'
            onClick={handleSubstract}
          >
            <SubstractIcon className='fill-grey-500' />
          </button>
          <div className='h-6 w-px bg-grey-300' />
          <button
            type='button'
            className='rounded-full hover:bg-grey-200 mx-2'
            onClick={handleAdd}
          >
            <AddIcon className='fill-grey-500' />
          </button>
        </>
      }
      {...rest}
    />
  );
});

NumberInput.defaultProps = defaultProps;

export default NumberInput;
