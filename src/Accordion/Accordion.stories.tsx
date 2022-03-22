import React from 'react';
import { Story, Meta } from '@storybook/react';

import Accordion from './Accordion';

export default {
  title: 'Accordion',
  component: Accordion,
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof Accordion>
> = args => (
  <Accordion {...args}>
    <Accordion.Toggle>
      <Accordion.Summary className='bg-gray-300'>
        Summary
        <Accordion.Button />
      </Accordion.Summary>
    </Accordion.Toggle>
    <Accordion.Detail className='bg-gray-200'>Detail</Accordion.Detail>
  </Accordion>
);
PlayGround.args = { children: '直接在 Children 放文字就可以了' };
