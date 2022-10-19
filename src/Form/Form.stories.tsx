import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { within, screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Textarea from '../Textarea';
import Form, { FormProps } from './index';
import AutoTextInput from '../AutoTextInput';

export default {
  title: 'Form',
  component: Form,
} as Meta;

export const PlayGround: Story<FormProps> = args => {
  return (
    <Form onSubmit={action('form submitted')}>
      {({ reset }) => (
        <>
          <Form.Field name='simplestCase' />
          <Form.Field label='test' name='test' as={Textarea} />
          <Form.Field required label='test2' name='test2' as={Textarea} />
          <Form.Field
            required
            name='test3'
            as={AutoTextInput}
            defaultOptions={['aaaa', 'ahde']}
          />
          <button
            type='button'
            onClick={() => {
              reset({ simplestCase: 'simple', test3: 'aaa' });
            }}
          >
            reset
          </button>
          <button type='submit'>submit</button>
        </>
      )}
    </Form>
  );
};
PlayGround.args = {};

export const TestingSubmission: Story<FormProps> = args => {
  const [result, setResult] = React.useState('');
  const handleSubmit = d => {
    setResult(JSON.stringify(d));
  };
  return (
    <Form onSubmit={handleSubmit}>
      {({ reset }) => (
        <>
          <Form.Field name='reset' />
          <Form.Field
            data-testid='required'
            required
            name='required'
            as={Textarea}
          />
          <Form.Field
            required
            name='autoTextInput'
            as={AutoTextInput}
            defaultOptions={['aaaa', 'ahde']}
          />
          <button
            className='mr-4'
            type='button'
            data-testid='reset'
            onClick={() => {
              reset({ reset: 'default', autoTextInput: 'aaa' });
            }}
          >
            reset
          </button>
          <button type='submit'>submit</button>
          <div>{result}</div>
        </>
      )}
    </Form>
  );
};
TestingSubmission.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByText('reset', { selector: 'button' }));
  await expect(
    canvas.getByText('default', { selector: 'textarea' })
  ).toBeInTheDocument();
  await expect(
    canvas.getByText('aaa', { selector: 'input' })
  ).toBeInTheDocument();

  await userEvent.type(canvas.getByTestId('required'), 'required');

  await userEvent.click(canvas.getByText('submit', { selector: 'button' }));
  await expect(
    await canvas.findByText(
      '{"reset":"default","autoTextInput":"aaa","required":"required"}'
    )
  ).toBeInTheDocument();
};

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
