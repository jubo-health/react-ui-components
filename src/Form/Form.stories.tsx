import React from 'react';
import { Story, Meta } from '@storybook/react';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
    <Form
      onSubmit={a => {
        console.log(a);
      }}
      resolver={resolver}
    >
      {({ register, formState: { errors } }) => (
        <>
          <FormField>
            <FormField.Label>manual</FormField.Label>
            <FormField.Container>
              <Textarea {...register('manual')} />
              {errors.manual ? (
                <FormField.Caption>{errors.manual.message}</FormField.Caption>
              ) : null}
            </FormField.Container>
          </FormField>
          <FormField>
            <FormField.Label>multiple</FormField.Label>
            <div className='flex-1 flex gap-2'>
              <FormField.Container>
                <Textarea
                  status={errors.multi1 ? 'error' : 'default'}
                  {...register('multi1')}
                />
                {errors.multi1 ? (
                  <FormField.Caption status='error'>
                    {errors.multi1.message}
                  </FormField.Caption>
                ) : null}
              </FormField.Container>
              <FormField.Container>
                <Textarea
                  status={errors.multi2 ? 'error' : 'default'}
                  {...register('multi2', { required: true })}
                />
                {errors.multi2 ? (
                  <FormField.Caption status='error'>
                    {errors.multi2.message}
                  </FormField.Caption>
                ) : null}
              </FormField.Container>
            </div>
          </FormField>
          <Form.Field label='test' name='test' as={Textarea} />
          <button type='submit'>submit</button>
        </>
      )}
    </Form>
  );
};
ManualComposed.args = {};
