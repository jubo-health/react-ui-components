import React from 'react';
import { Story, Meta } from '@storybook/react';

import Checkbox from './index';

export default {
  title: 'Checkbox',
  component: Checkbox,
} as Meta;

export const PlayGround: Story<
  React.ComponentProps<typeof Checkbox>
> = args => {
  const [optionValue, setOptionValue] = React.useState(['a']);
  const [checkboxValue, setCheckboxValue] = React.useState(['v']);
  return (
    <>
      <div>
        <div>Using Options</div>
        <Checkbox
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
        <Checkbox onChange={setCheckboxValue} value={checkboxValue}>
          <Checkbox.Option value='f'>f</Checkbox.Option>
          <Checkbox.Option value='v'>v</Checkbox.Option>
        </Checkbox>
      </div>
    </>
  );
};
PlayGround.args = {};
