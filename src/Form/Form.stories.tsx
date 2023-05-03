import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';

import Textarea from '../Textarea';
import TextInput from '../TextInput';
import Form, { FormProps, useForm, useWatch } from './index';
import AutoTextInput from '../AutoTextInput';
import Radio from '../Radio';
import { halt } from '../storyUtils';
import Checkbox from '../Checkbox';

export default {
  title: 'Form',
  component: Form,
} as Meta;

export const CompleteForm: Story<FormProps> = args => {
  const methods = useForm({ mode: 'onBlur' });
  const [result, setResult] = React.useState('');
  const handleSubmit = (d: any) => {
    console.log(d);
    setResult(JSON.stringify(d));
  };
  const [show, setShow] = React.useState(true);

  const { control } = methods;
  const watchAll = useWatch({ control });
  const watchOne = useWatch({ name: 'maybeHidden', control });
  const watchMultiple = useWatch({
    name: ['maybeHidden', 'textInput'],
    control,
  });
  console.log('watchAll', watchAll, watchOne, watchMultiple);
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
      <Form.Field
        name='radio'
        required
        as={Radio}
        options={[
          { value: 'radio1', label: 'radio1' },
          { value: 'radio2', label: 'radio2' },
          { value: 'radio3', label: 'radio3' },
          { value: 'radio4', label: 'radio4' },
        ]}
      />
      <Form.Field
        name='check'
        as={Checkbox}
        options={[
          { value: 'option1', label: 'option1' },
          { value: 'option2', label: 'option2' },
          { value: 'option3', label: 'option3' },
          { value: 'option4', label: 'option4' },
        ]}
      >
        <Checkbox.Option value='option1'>option1</Checkbox.Option>
        <Checkbox.Option value='option2'>option2</Checkbox.Option>
        <Checkbox.Option value='option3'>option3</Checkbox.Option>
        <Checkbox.Option value='option4'>option4</Checkbox.Option>
      </Form.Field>
      <Form.Fragment>
        <button
          type='button'
          onClick={() => {
            setShow(prev => !prev);
          }}
        >
          show
        </button>
      </Form.Fragment>
      {show && <Form.Field data-testid='maybeHidden' name='maybeHidden' />}

      <Form.Fragment>
        <button
          className='border rounded p-2'
          type='button'
          data-testid='reset'
          onClick={() => {
            methods.reset({
              default: 'default',
              autoTextInput: 'aaa',
              textInput: 'textInput',
              maybeHidden: 'true',
            });
          }}
        >
          reset
        </button>
        <button className='border rounded p-2' type='submit'>
          submit
        </button>
        <button
          className='border rounded p-2'
          type='button'
          onClick={() => {
            setResult(JSON.stringify(methods.getValues()));
          }}
        >
          getAllValues
        </button>
        <button
          className='border rounded p-2'
          type='button'
          onClick={() => {
            setResult(JSON.stringify(methods.getValues('maybeHidden')));
          }}
        >
          getTheValues
        </button>
        <button
          className='border rounded p-2'
          type='button'
          onClick={() => {
            setResult(
              JSON.stringify(methods.getValues(['maybeHidden', 'textInput']))
            );
          }}
        >
          getSomeValues
        </button>
        <div id='result' data-testid='result'>
          {result}
        </div>
        <div id='watchAll' data-testid='watchAll'>
          {JSON.stringify(watchAll)}
        </div>
        <div id='watchOne' data-testid='watchOne'>
          {JSON.stringify(watchOne)}
        </div>
        <div id='watchMultiple' data-testid='watchMultiple'>
          {JSON.stringify(watchMultiple)}
        </div>
      </Form.Fragment>
    </Form>
  );
};
CompleteForm.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByText('reset', { selector: 'button' }));
  await userEvent.click(canvas.getByText('submit', { selector: 'button' }));
  await halt();
  await expect(canvas.getAllByText('請輸入必填欄位').length).toBe(2);

  await expect(canvas.getByDisplayValue('textInput')).toBeInTheDocument();
  await expect(canvas.getByDisplayValue('default')).toBeInTheDocument();
  await expect(canvas.getByDisplayValue('aaa')).toBeInTheDocument();
  await userEvent.click(canvas.getByDisplayValue('radio1'));

  await userEvent.type(canvas.getByTestId('required'), 'required');

  // show
  await userEvent.click(canvas.getByText('submit', { selector: 'button' }));
  await halt();
  await expect(
    JSON.parse((await canvas.getByTestId('result')).textContent || '{}')
  ).toEqual({
    textInput: 'textInput',
    default: 'default',
    required: 'required',
    autoTextInput: 'aaa',
    radio: 'radio1',
    maybeHidden: 'true',
  });
  await expect(
    JSON.parse((await canvas.getByTestId('watchAll')).textContent || '{}')
  ).toEqual({
    textInput: 'textInput',
    default: 'default',
    required: 'required',
    autoTextInput: 'aaa',
    radio: 'radio1',
    maybeHidden: 'true',
  });
  await expect(await canvas.getByTestId('watchOne').textContent).toBe('"true"');
  await expect(
    JSON.parse((await canvas.getByTestId('watchMultiple')).textContent || '{}')
  ).toEqual(['true', 'textInput']);

  await userEvent.click(
    canvas.getByText('getAllValues', { selector: 'button' })
  );
  await expect(
    JSON.parse((await canvas.getByTestId('result')).textContent || '{}')
  ).toEqual({
    textInput: 'textInput',
    default: 'default',
    required: 'required',
    autoTextInput: 'aaa',
    radio: 'radio1',
    maybeHidden: 'true',
  });

  await userEvent.click(
    canvas.getByText('getTheValues', { selector: 'button' })
  );
  await expect((await canvas.getByTestId('result')).textContent).toBe('"true"');

  await userEvent.click(
    canvas.getByText('getSomeValues', { selector: 'button' })
  );
  await expect(
    JSON.parse((await canvas.getByTestId('result')).textContent || '{}')
  ).toEqual(['true', 'textInput']);

  // hide
  await userEvent.click(canvas.getByText('show', { selector: 'button' }));
  await userEvent.click(canvas.getByText('submit', { selector: 'button' }));
  await halt();
  await expect(
    JSON.parse((await canvas.getByTestId('result')).textContent || '{}')
  ).toEqual({
    textInput: 'textInput',
    default: 'default',
    required: 'required',
    autoTextInput: 'aaa',
    radio: 'radio1',
  });
  await expect(
    JSON.parse((await canvas.getByTestId('watchAll')).textContent || '{}')
  ).toEqual({
    textInput: 'textInput',
    default: 'default',
    required: 'required',
    autoTextInput: 'aaa',
    radio: 'radio1',
  });
  await expect(await canvas.getByTestId('watchOne').textContent).toBe('');
  await expect(
    JSON.parse((await canvas.getByTestId('watchMultiple')).textContent || '{}')
  ).toEqual([null, 'textInput']);

  await userEvent.click(
    canvas.getByText('getAllValues', { selector: 'button' })
  );
  await expect(
    JSON.parse((await canvas.getByTestId('result')).textContent || '{}')
  ).toEqual({
    textInput: 'textInput',
    default: 'default',
    required: 'required',
    autoTextInput: 'aaa',
    radio: 'radio1',
  });

  await userEvent.click(
    canvas.getByText('getTheValues', { selector: 'button' })
  );
  await expect(
    JSON.parse((await canvas.getByTestId('result')).textContent || '{}')
  ).toEqual({});

  await userEvent.click(
    canvas.getByText('getSomeValues', { selector: 'button' })
  );

  await expect(
    JSON.parse((await canvas.getByTestId('result')).textContent || '{}')
  ).toEqual([null, 'textInput']); // JSON.stringify tranlate [, 'a'] as [null, 'a']
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
