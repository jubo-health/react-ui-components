import React from 'react';
import { Story, Meta } from '@storybook/react';

import NewComponent from './index';

export default {
  title: 'NewComponent',
  component: NewComponent,
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof NewComponent>
> = args => <NewComponent {...args} />;
PlayGround.args = {};
