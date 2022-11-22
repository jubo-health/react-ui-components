import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Listbox } from '@headlessui/react';
import Item from './index';

export default {
  title: 'Item',
  component: Item,
} as Meta;

export const PlayGround: Story<React.ComponentProps<typeof Item>> = args => {
  return (
    <>
      <Listbox>
        <Listbox.Button>test</Listbox.Button>
        <Listbox.Options>
          <Listbox.Option value='value'>value</Listbox.Option>
        </Listbox.Options>
      </Listbox>
      <Item>test</Item>
    </>
  );
};
PlayGround.args = {};
