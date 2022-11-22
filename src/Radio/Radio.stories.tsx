import React from 'react';
import { Story, Meta } from '@storybook/react';

import Radio from './index';

export default {
  title: 'Radio',
  component: Radio,
} as Meta;

export const PlayGround: Story<React.ComponentProps<typeof Radio>> = args => {
  const [optionValue, setOptionValue] = React.useState('a');
  const [radioValue, setRadioValue] = React.useState('v');
  return (
    <>
      <div>
        <div>Using Options</div>
        <Radio
          onChange={e => {
            setOptionValue(e.target.value);
          }}
          value={optionValue}
          options={[
            { value: 'a', label: 'a' },
            { value: 'b', label: 'b' },
          ]}
        />
      </div>

      <div>
        <div>Using Children</div>
        <Radio
          onChange={e => {
            setRadioValue(e.target.value);
          }}
          value={radioValue}
        >
          <Radio.Option value='f'>f</Radio.Option>
          <Radio.Option value='v'>v</Radio.Option>
        </Radio>
      </div>
    </>
  );
};
PlayGround.args = {};
