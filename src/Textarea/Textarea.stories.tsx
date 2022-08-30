import React from 'react';
import { Story, Meta } from '@storybook/react';

import Textarea, { TextareaProps } from './Textarea';
import TextInput from '../TextInput';

export default {
  title: 'Textarea',
  component: Textarea,
} as Meta;

export const PlayGround: Story<TextareaProps> = args => <Textarea {...args} />;
PlayGround.args = {
  placeholder: 'Textarea placeholder',
};

export const Usecase: Story<TextareaProps> = args => {
  const [case1, setCase1] = React.useState(
    'sometimes I just dont know how to d'
  );
  const [case2, setCase2] = React.useState(
    'sometimes I sometimes I sometimes I sometimes I sometimes I sometimes I sometimes I sometimes I sometimes I'
  );
  return (
    <>
      <div className='mb-8'>
        <div className='font-bold'>scroll bar should not show</div>
        <Textarea
          className='w-40'
          onChange={e => {
            setCase1(e.currentTarget.value);
          }}
        >
          {case1}
        </Textarea>
      </div>
      <div className='mb-8'>
        <div className='font-bold'>scroll bar should not show</div>
        <Textarea
          onChange={e => {
            setCase2(e.currentTarget.value);
          }}
        >
          {case2}
        </Textarea>
      </div>
      <div className='mb-8'>
        <div className='font-bold'>should align</div>
        <Textarea className='w-10' defaultValue='align' />
        <Textarea className='w-10' placeholder='Align' />
        <TextInput className='w-10' defaultValue='align' />
        <TextInput className='w-10' placeholder='Align' />
      </div>
    </>
  );
};
