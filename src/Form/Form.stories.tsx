import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';

import { useForm } from 'react-hook-form';
import Textarea from '../Textarea';
import TextInput from '../TextInput';
import Form, { FormProps } from './index';
import AutoTextInput from '../AutoTextInput';
import { halt } from '../storyUtils';

export default {
  title: 'Form',
  component: Form,
} as Meta;

export const CompleteForm: Story<FormProps> = args => {
  const methods = useForm({ mode: 'onBlur' });
  const [result, setResult] = React.useState('');
  const handleSubmit = (d: any) => {
    setResult(JSON.stringify(d));
  };
  return (
    <Form {...methods} onSubmit={handleSubmit}>
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
      <Form.Fragment>
        <button
          className='mr-4'
          type='button'
          data-testid='reset'
          onClick={() => {
            methods.reset({
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
      </Form.Fragment>
    </Form>
  );
};
CompleteForm.play = async ({ canvasElement }) => {
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
  const methods = useForm({ mode: 'onBlur', resolver });
  return (
    <Form {...methods} onSubmit={action('form submitted')}>
      <Form.Field name='aaa' />

      <Form.Label>manual</Form.Label>
      <Form.Input name='manual' />

      <Form.Label>multiple</Form.Label>
      <div className='flex gap-2'>
        <Form.Input name='multi1' />
        <Form.Input name='multi2' />
      </div>

      <Form.Label>multiple</Form.Label>
      <div className='flex gap-2'>
        <Form.Input name='multi3' />
        <Form.Input name='multi4' />
      </div>

      <Form.Field label='test' name='test' as={Textarea} />
      <Form.Fragment>
        <button type='submit'>submit</button>
      </Form.Fragment>
    </Form>
  );
};
ManualComposed.args = {};
