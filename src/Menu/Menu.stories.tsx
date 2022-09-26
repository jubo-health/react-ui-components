import React from 'react';
import { Story, Meta } from '@storybook/react';

import Menu from './index';

export default {
  title: 'Menu',
  component: Menu,
} as Meta;

export const PlayGround: Story<React.ComponentProps<typeof Menu>> = args => (
  <Menu>
    <Menu.Item>test</Menu.Item>
    <Menu.Item>test2</Menu.Item>
    <Menu.Item>test3</Menu.Item>
  </Menu>
);
PlayGround.args = {};
