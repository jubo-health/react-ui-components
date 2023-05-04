import React from 'react';
import { Story, Meta } from '@storybook/react';

import Radio from './index';

export default {
  title: 'Radio',
  component: Radio,
} as Meta;

export const PlayGround: Story<React.ComponentProps<typeof Radio>> = args => {
  const [optionValue, setOptionValue] = React.useState<string | null>('a');
  const [radioValue, setRadioValue] = React.useState<string | null>('v');
  return (
    <>
      <div>
        <div>Using Options</div>
        <Radio
          onChange={setOptionValue}
          value={optionValue}
          options={[
            { value: 'a', label: 'a' },
            { value: 'b', label: 'b' },
          ]}
        />
      </div>

      <div>
        <div>Using Children</div>
        <Radio onChange={setRadioValue} value={radioValue}>
          <Radio.Option value='f'>f</Radio.Option>
          <Radio.Option value='v'>v</Radio.Option>
        </Radio>
      </div>
    </>
  );
};
PlayGround.args = {};
