import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Listbox } from '@headlessui/react';
import Popover from './index';
import Item from '../Item';

export default {
  title: 'Popover',
  component: Popover,
} as Meta;

export const PlayGround: Story<React.ComponentProps<typeof Popover>> = args => {
  return (
    <Listbox>
      <Listbox.Button>test</Listbox.Button>
      <Listbox.Options as={Popover}>
        <Listbox.Option as={Item} value='value'>
          value
        </Listbox.Option>
      </Listbox.Options>
    </Listbox>
  );
};
PlayGround.args = {};
