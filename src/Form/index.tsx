import React from 'react';
import {
  useForm,
  FormProvider,
  useFormContext,
  useFormState,
  Resolver,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import FormField from '../FormField';

export interface FormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  resolver?: Resolver;
  onError?: any;
  onSubmit: SubmitHandler<FieldValues>;
}

const Form = function Form(props: FormProps) {
  const { resolver, onSubmit, onError, children } = props;
  const methods = useForm({
    mode: 'onBlur',
    resolver,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)}>{children}</form>
    </FormProvider>
  );
};

/** 參考 headless ui 做的 https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-react/src/types.ts */
export type PropsOf<BasicElement = 'div'> =
  BasicElement extends React.ElementType
    ? React.ComponentProps<BasicElement>
    : never;

export type ComponentProps<BasicElement> = {
  component?: BasicElement;
};

const DEFAULT_BASE = 'input';
interface FieldOnlyProps extends React.ComponentProps<typeof FormField> {
  name: string;
  label?: string;
  sublabel?: string;
  caption?: string;
  status?: 'default' | 'warning' | 'error';
  required?: boolean;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
}
export type FieldProps<BaseElement> = ComponentProps<BaseElement> &
  PropsOf<BaseElement> &
  FieldOnlyProps;

const Field = <BaseElement extends React.ElementType = typeof DEFAULT_BASE>(
  props: FieldProps<BaseElement>
) => {
  const {
    name,
    component,
    required,
    onChange,
    onBlur,
    label,
    sublabel,
    caption,
    status,
    ...rest
  } = props;
  const { register } = useFormContext();
  const { errors } = useFormState();

  return (
    <FormField
      label={label}
      sublabel={sublabel}
      caption={errors[name]?.type === 'required' ? '請輸入必填欄位' : caption}
      status={errors[name] ? 'error' : status}
      required={required}
    >
      {React.createElement(component, {
        status: errors[name] ? 'error' : undefined,
        ...register(name, {
          validate: {
            required: d =>
              !required ||
              (d && typeof d === 'object'
                ? Object.keys(d).length > 0
                : d && d !== 0 && d !== false),
          },
          onChange,
          onBlur,
        }),
        ...rest,
      })}
    </FormField>
  );
};
Field.defaultProps = {
  component: DEFAULT_BASE,
};

Form.Field = Field;

export default Form;
