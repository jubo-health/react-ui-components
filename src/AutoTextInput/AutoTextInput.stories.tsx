import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AutoTextInput, { AutoTextFieldProvider } from './index';

export default {
  title: 'AutoTextInput',
  component: AutoTextInput,
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof AutoTextInput>
> = args => {
  return <AutoTextInput className='w-full' {...args} />;
};
let remoteOptions = ['ccc', 'ddd'];
PlayGround.args = {
  defaultOptions: [
    'opt',
    'option',
    'i am an option',
    'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
  ],
  fieldName: 'name',
  onCreate: (...params: any) => {
    action(`create with params: ${params}`)();
    remoteOptions = [...remoteOptions, params[1]];
  },
  onDelete: (...params: any) => {
    action(`delete with params: ${params}`)();
    const index = remoteOptions.findIndex(option => option === params[1]);
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
