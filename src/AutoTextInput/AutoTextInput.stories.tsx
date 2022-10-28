import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { reduxForm, Field, reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import AutoTextInput from './index';
import TextInput from '../TextInput';
import { halt } from '../storyUtils';

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass formReducer under 'form' key,
  // for custom keys look up the docs for 'getFormState'
  form: formReducer,
});

const store = createStore(rootReducer);

export default {
  title: 'AutoTextInput',
  component: AutoTextInput,
} as Meta;

const Component = ({
  input: { name, onChange, value, ...inputProps },
  className,
  onChange: propsOnChange,
  ...rest
}) => {
  return (
    <AutoTextInput
      name={name}
      value={value}
      onChange={v => {
        console.log('redux onChange', v);
        onChange(v);
      }}
    />
  );
};

const Input = ({
  input: { name, onChange, value, ...inputProps },
  className,
  onChange: propsOnChange,
  ...rest
}) => {
  return (
    <TextInput
      name={name}
      className='w-full'
      value={value}
      onChange={v => {
        console.log('redux onChange', v);
        onChange(v);
        if (propsOnChange) {
          propsOnChange(v);
        }
      }}
      {...inputProps}
      {...rest}
    />
  );
};

const Form = reduxForm({
  form: 'ServiceRecord',
})(props => {
  const [value, setValue] = React.useState('');
  return (
    <form>
      <Component input={{ value, onChange: setValue }} />
      <Field name='test' component={Component} />
      <Field name='test2' component={Input} />
    </form>
  );
});

export const Develop: Story<
  React.ComponentProps<typeof AutoTextInput>
> = args => {
  const [value, setValue] = React.useState('');
  return (
    <Provider store={store}>
      <Form />
    </Provider>
  );
};

export const PlayGround: Story<
  React.ComponentProps<typeof AutoTextInput>
> = args => {
  const [value, setValue] = React.useState('');
  return (
    <>
      <AutoTextInput
        data-testid='auto-text-input'
        className='w-80'
        {...args}
        value={value}
        onChange={setValue}
      />
      <div className='h-80 m-80' />
    </>
  );
};
let remoteOptions = ['ccc', 'dad', 'ddd', { value: 'test' }];
PlayGround.args = {
  placeholder: '請輸入文字',
  defaultOptions: [
    'opt',
    'option',
    'i am an option',
    'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglong',
  ],
  fieldName: 'name',
  onCreate: async (...params: any) => {
    action('create')(params);
    await new Promise(resolve => {
      setTimeout(() => {
        resolve('');
      }, 1000);
    });
    remoteOptions = [...remoteOptions, params[1]];
  },
  onDelete: async (...params: any) => {
    action('delete')(params);
    const index = remoteOptions.findIndex(option => option === params[1]);
    await new Promise(resolve => {
      setTimeout(() => {
        resolve('');
      }, 1000);
    });
    remoteOptions =
      index !== -1
        ? remoteOptions.slice(0, index).concat(remoteOptions.slice(index + 1))
        : remoteOptions;
  },
  onFetch: async (...params: any) => {
    action(`fetching with params: ${params}`)();
    await new Promise(resolve => {
      setTimeout(() => {
        resolve('');
      }, 1000);
    });
    return remoteOptions;
  },
};
PlayGround.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByTestId('auto-text-input'));
  await expect(await canvas.findByText('option')).toBeInTheDocument();
  await halt(1100);
  await userEvent.keyboard('d');
  await halt(300);
  await userEvent.keyboard('[ArrowDown]');
  await halt();
  await userEvent.keyboard('[Enter]');
  await halt(100);
  await expect(canvas.getByDisplayValue('ddd')).toBeInTheDocument();
  await userEvent.click(await canvas.findByRole('button'));
};

export const LongList = () => {
  const [value, setValue] = React.useState('');
  const options = React.useMemo(
    () =>
      Array(20000)
        .fill('')
        .map(() => (Math.random() + 1).toString(36).substring(7)),
    []
  );
  return (
    <AutoTextInput value={value} onChange={setValue} defaultOptions={options} />
  );
};
