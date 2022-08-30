import React from 'react';
import { Story, Meta } from '@storybook/react';

import Textarea from '../Textarea';
import FormField from '../FormField';
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

export const ManualComposed: Story<FormProps> = args => {
  return (
    <Form
      onSubmit={a => {
        console.log(a);
      }}
    >
      {({ register, formState: { errors } }) => (
        <>
          <FormField>
            <FormField.Label>manual</FormField.Label>
            <FormField.Container>
              <Textarea {...register('manual')} />
              {errors.manual ? (
                <FormField.Caption>{errors.manual.type}</FormField.Caption>
              ) : null}
            </FormField.Container>
          </FormField>
          <FormField>
            <FormField.Label>multiple</FormField.Label>
            <div className='flex-1 flex gap-2'>
              <FormField.Container>
                <Textarea {...register('multi1')} />
                {errors.multi1 ? (
                  <FormField.Caption>{errors.multi1.type}</FormField.Caption>
                ) : null}
              </FormField.Container>
              <FormField.Container>
                <Textarea
                  status={errors.multi2 ? 'error' : 'default'}
                  {...register('multi2', { required: true })}
                />
                {errors.multi2 ? (
                  <FormField.Caption status='error'>
                    {errors.multi2.type}
                  </FormField.Caption>
                ) : null}
              </FormField.Container>
            </div>
          </FormField>
          <Form.Field label='test' name='test' component={Textarea} />
          <button type='submit'>submit</button>
        </>
      )}
    </Form>
  );
};
ManualComposed.args = {};
