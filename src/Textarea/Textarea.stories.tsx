import React from 'react';
import { Story, Meta } from '@storybook/react';

import Textarea, { TextareaProps } from './Textarea';
import Input from '../Input';

export default {
  title: 'Textarea',
  component: Textarea,
} as Meta;

export const PlayGround: Story<TextareaProps> = args => (
  <Textarea className='w-40' {...args} />
);
PlayGround.args = {};

export const Usecase: Story<TextareaProps> = args => {
  const [case1, setCase1] = React.useState(
    'sometimes I just dont know how to d'
  );
  const [case2, setCase2] = React.useState(
    'sometimes I sometimes I sometimes I sometimes I sometimes I sometimes I sometimes I sometimes I sometimes I'
  );
  return (
    <div>
      <div>scroll bar should not show</div>
      <Textarea
        className='w-40'
        onChange={e => {
          setCase1(e.currentTarget.value);
        }}
      >
        {case1}
      </Textarea>
      <div>scroll bar should not show</div>
      <Textarea
        onChange={e => {
          setCase2(e.currentTarget.value);
        }}
      >
        {case2}
      </Textarea>
    </div>
  );
};
PlayGround.args = {};
