import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Textarea from '../Textarea';
import Form, { FormProps } from './index';

export default {
  title: 'Form',
  component: Form,
} as Meta;

export const PlayGround: Story<FormProps> = args => {
  return (
    <Form onSubmit={action('form submitted')}>
      <Form.Field name='simplestCase' />
      <Form.Field label='test' name='test' as={Textarea} />
      <Form.Field required label='test2' name='test2' as={Textarea} />
      <button type='submit'>submit</button>
    </Form>
  );
};
PlayGround.args = {};

export const ManualComposed: Story<FormProps> = args => {
  const resolver = React.useMemo(
    () =>
      yupResolver(
        yup.object({
          multi1: yup.string().required(),
          multi2: yup.string().required(),
        })
      ),
    []
  );
  return (
    <Form onSubmit={action('form submitted')} resolver={resolver}>
      <Form.Container>
        <Form.Label>manual</Form.Label>
        <Form.Register name='manual'>
          <Form.Register.Input />
          <Form.Register.ErrorCaption />
        </Form.Register>
      </Form.Container>
      <Form.Container>
        <Form.Label>multiple</Form.Label>
        <div className='flex-1 flex gap-2'>
          <Form.Register name='multi1'>
            <Form.Register.Input as={Textarea} />
            <Form.Register.ErrorCaption />
          </Form.Register>
          <Form.Register name='multi2'>
            <Form.Register.Input as={Textarea} />
            <Form.Register.ErrorCaption />
          </Form.Register>
        </div>
      </Form.Container>
      <Form.Field label='test' name='test' as={Textarea} />
      <button type='submit'>submit</button>
    </Form>
  );
};
ManualComposed.args = {};
