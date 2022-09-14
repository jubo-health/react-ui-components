import React from 'react';
import { Story, Meta } from '@storybook/react';

import AutoTextarea from './index';

export default {
  title: 'AutoTextarea',
  component: AutoTextarea,
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof AutoTextarea>
> = args => {
  const externalRef = React.useRef<any>(null);
  return <AutoTextarea {...args} ref={externalRef} />;
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
