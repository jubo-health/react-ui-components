import React from 'react';
import { Story, Meta } from '@storybook/react';

import Form, { useForm } from './index';

export default {
  title: 'Form.Label',
  component: Form.Label,
  argTypes: {
    label: {
      description: 'label text (or element) shows in the left.',
    },
  },
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof Form.Label>
> = args => {
  const methods = useForm({ mode: 'onBlur' });
  return (
    <Form {...methods} onSubmit={() => {}}>
      <Form.Label {...args} />
    </Form>
  );
};
