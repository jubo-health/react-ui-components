import React from 'react';
import { Story, Meta } from '@storybook/react';

import Textarea from '../Textarea';
import Form, { FormProps } from './index';

export default {
  title: 'Form',
  component: Form,
} as Meta;

export const PlayGround: Story<FormProps> = args => {
  return (
    <Form
      onSubmit={a => {
        console.log(a);
      }}
    >
      <Form.Field label='test' name='test' component={Textarea} />
      <Form.Field required label='test2' name='test2' component={Textarea} />
      <button type='submit'>submit</button>
    </Form>
  );
};
PlayGround.args = {};
