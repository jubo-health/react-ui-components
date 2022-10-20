import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { within, screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';

import Textarea from '../Textarea';
import TextInput from '../TextInput';
import Form, { FormProps } from './index';
import AutoTextInput from '../AutoTextInput';

const halt = (duration = 0) =>
  new Promise(r => {
    setTimeout(r, duration); // 要等才會過 why?
  });

export default {
  title: 'Form',
  component: Form,
} as Meta;

export const Basic: Story<FormProps> = args => {
  const [result, setResult] = React.useState('');
  const handleSubmit = (d: any) => {
    setResult(JSON.stringify(d));
  };
  return (
    <Form onSubmit={handleSubmit}>
      {({ reset }) => (
        <>
          <Form.Field data-testid='default' name='default' />
          <Form.Field
            data-testid='required'
            required
            name='required'
            as={Textarea}
          />
          <Form.Field
            data-testid='autoTextInput'
            required
            name='autoTextInput'
            as={AutoTextInput}
            defaultOptions={['aaaa', 'ahde']}
          />
          <Form.Field name='textInput' as={TextInput} />
          <button
            className='mr-4'
            type='button'
            data-testid='reset'
            onClick={() => {
              reset({
                default: 'default',
                autoTextInput: 'aaa',
                textInput: 'textInput',
              });
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
Basic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByText('reset', { selector: 'button' }));
  await userEvent.click(canvas.getByText('submit', { selector: 'button' }));
  await halt();
  await expect(canvas.getByText('請輸入必填欄位')).toBeInTheDocument();

  await expect(canvas.getByDisplayValue('textInput')).toBeInTheDocument();
  await expect(canvas.getByDisplayValue('default')).toBeInTheDocument();
  await expect(canvas.getByDisplayValue('aaa')).toBeInTheDocument();

  await userEvent.type(canvas.getByTestId('required'), 'required');

  await userEvent.click(canvas.getByText('submit', { selector: 'button' }));
  await expect(
    await canvas.findByText(
      '{"textInput":"textInput","default":"default","required":"required","autoTextInput":"aaa"}'
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
