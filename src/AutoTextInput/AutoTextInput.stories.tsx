import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useForm } from 'react-hook-form';

import AutoTextInput from './index';

export default {
  title: 'AutoTextInput',
  component: AutoTextInput,
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof AutoTextInput>
> = args => {
  return (
    <>
      <AutoTextInput className='w-80' {...args} />
      <div className='h-80 m-80' />
    </>
  );
};
let remoteOptions = ['ccc', 'ddd', { value: 'test' }];
PlayGround.args = {
  placeholder: '請輸入文字',
  defaultOptions: [
    'opt',
    'option',
    'i am an option',
    'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
  ],
  fieldName: 'name',
  onCreate: async (...params: any) => {
    action('create')(params);
    await new Promise(resolve => {
      setTimeout(() => {
        resolve('');
      }, 1000);
    });
    remoteOptions = [...remoteOptions, params[1]];
  },
  onDelete: async (...params: any) => {
    action('delete')(params);
    const index = remoteOptions.findIndex(option => option === params[1]);
    await new Promise(resolve => {
      setTimeout(() => {
        resolve('');
      }, 1000);
    });
    remoteOptions =
      index !== -1
        ? remoteOptions.slice(0, index).concat(remoteOptions.slice(index + 1))
        : remoteOptions;
  },
  onFetch: async (...params: any) => {
    action(`fetching with params: ${params}`)();
    await new Promise(resolve => {
      setTimeout(() => {
        resolve('');
      }, 1000);
    });
    return remoteOptions;
  },
};

const Input = React.forwardRef<HTMLInputElement, any>((props, ref) => {
  console.log('props', props);
  const { name, onChange, onBlur } = props;
  return (
    <input
      id='aaa'
      ref={ref}
      name={name}
      onChange={onChange}
      // onBlur={onBlur}
      autoComplete='false'
    />
  );
});

export const Controlled = () => {
  const [value, setValue] = React.useState('');
  const ref = React.useRef<HTMLInputElement>(null);
  const { register, handleSubmit } = useForm();

  return (
    <form
      onSubmit={handleSubmit(d => {
        console.log(d);
      })}
    >
      <button
        type='button'
        onClick={() => {
          document.getElementById('aaa').value = 'newValue';
        }}
      >
        set
      </button>
      <Input {...register('test')} />
      <button type='submit'>submit</button>
      <AutoTextInput
        value={value}
        onChange={e => {
          console.log('onChange');
          console.log('r', e);
          setValue(e?.currentTarget.value || '');
        }}
        defaultOptions={['asdf', 'aa']}
      />
      <input
        ref={ref}
        value={value}
        onChange={e => {
          console.log('AAA Change', e);
          setValue(e.target.value);
        }}
      />
      <button
        type='button'
        onClick={() => {
          const valueSetter = Object?.getOwnPropertyDescriptor(
            ref.current,
            'value'
          ).set;
          const prototype = Object.getPrototypeOf(ref.current);
          const prototypeValueSetter = Object.getOwnPropertyDescriptor(
            prototype,
            'value'
          ).set;

          if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(ref.current, 'newValue');
          } else {
            valueSetter.call(ref.current, 'newValue');
          }
          setValue('newValue');
          ref.current?.dispatchEvent(new Event('input', { bubbles: true }));
        }}
      >
        SET VALUE
      </button>
    </form>
  );
};
