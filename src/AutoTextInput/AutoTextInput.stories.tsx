import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

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

export const Controlled = () => {
  const [value, setValue] = React.useState('');
  return <AutoTextInput value={value} onChange={setValue} />;
};

export const LongList = () => {
  const [value, setValue] = React.useState('');
  const options = React.useMemo(
    () =>
      Array(20000)
        .fill('')
        .map(() => (Math.random() + 1).toString(36).substring(7)),
    []
  );
  return (
    <AutoTextInput value={value} onChange={setValue} defaultOptions={options} />
  );
};
