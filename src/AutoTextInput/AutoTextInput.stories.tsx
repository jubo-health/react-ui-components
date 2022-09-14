import React from 'react';
import { Story, Meta } from '@storybook/react';

import AutoTextInput from './index';

export default {
  title: 'AutoTextInput',
  component: AutoTextInput,
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof AutoTextInput>
> = args => {
  const externalRef = React.useRef<any>(null);
  return <AutoTextInput {...args} ref={externalRef} />;
};
PlayGround.args = {
  defaultOptions: [
    'opt',
    'option',
    'i am an option',
    'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
  ],
  onFetch: async () => [],
};
