import React from 'react';
import {
  useForm,
  useFormContext,
  useFormState,
  UseFormReturn,
  FormProvider,
  Resolver,
  SubmitHandler,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';

import Textarea from '../Textarea';
import { PropsOf, AsProps } from '../types';
import StatusCaption from './StatusCaption';

const DEFAULT_BASE = Textarea;

interface FormRegisterProps extends RegisterOptions {
  name: string;
  children: React.ReactNode;
}

const FormRegisterContext = React.createContext<
  Omit<FormRegisterProps, 'children'>
>({ name: '' });

const FormRegister = (props: FormRegisterProps) => {
  const { children, ...rest } = props;
  const { current: value } = React.useRef(rest);
  return (
    <FormRegisterContext.Provider value={value}>
      <div className='flex-1 [&>*]:w-full'>{children}</div>
    </FormRegisterContext.Provider>
  );
};

export type FieldInputProps<BaseElement> = AsProps<BaseElement> &
  PropsOf<BaseElement>;

function FieldInput<
  BaseElement extends React.ElementType = typeof DEFAULT_BASE
>(props: FieldInputProps<BaseElement>) {
  const { as, ...rest } = props;
  const { name, required, ...options } = React.useContext(FormRegisterContext);
  const { register } = useFormContext();
  const { errors } = useFormState();

  return React.createElement(as || DEFAULT_BASE, {
    status: errors[name] ? 'error' : undefined,
    ...register(name, {
      ...options,
      validate: {
        required: d =>
          !required ||
          (d && typeof d === 'object'
            ? Object.keys(d).length > 0
            : d && d !== 0 && d !== false),
      },
    }),
    ...rest,
  });
}

const ErrorCaption = ({ children }: { children?: React.ReactNode }) => {
  const { name } = React.useContext(FormRegisterContext);
  const { errors } = useFormState();

  return (
    <StatusCaption status='error'>
      {errors[name] ? errors[name]?.message || '請輸入必填欄位' : children}
    </StatusCaption>
  );
};

FormRegister.Input = FieldInput;
FormRegister.ErrorCaption = ErrorCaption;

const Container = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className='sm:flex' {...props} />
);

interface FieldLabelProps {
  children: React.ReactNode;
  required?: boolean;
  sublabel?: string;
}

const FieldLabel = (props: FieldLabelProps) => {
  const { children, required, sublabel } = props;

  return (
    <div>
      <div className='whitespace-prewrap break-words w-32 mr-4 text-lg leading-6 pt-2 pb-1 capitalize'>
        {children}
        {required && (
          <span className='relative'>
            <div className='absolute inline w-1.5 h-1.5 bg-secondary rounded-full ml-1' />
          </span>
        )}
      </div>
      <div className='text-xs text-grey-500'>{sublabel}</div>
    </div>
  );
};

interface FieldOnlyProps
  extends Omit<React.ComponentProps<typeof FieldLabel>, 'children'> {
  name: string;
  label?: string;
  caption?: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
}
export type FieldProps<BaseElement> = AsProps<BaseElement> &
  PropsOf<BaseElement> &
  FieldOnlyProps;

const Field = <BaseElement extends React.ElementType = typeof DEFAULT_BASE>(
  props: FieldProps<BaseElement>
) => {
  const {
    name,
    as,
    required,
    onChange,
    onBlur,
    label,
    sublabel,
    caption,
    ...rest
  } = props;

  return (
    <Container>
      <FieldLabel sublabel={sublabel} required={required}>
        {label || name}
      </FieldLabel>
      <FormRegister name={name} onChange={onChange} onBlur={onBlur}>
        <FormRegister.Input as={as} {...rest} />
        <FormRegister.ErrorCaption>{caption}</FormRegister.ErrorCaption>
      </FormRegister>
    </Container>
  );
};

export interface FormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  resolver?: Resolver;
  onError?: any;
  onSubmit: SubmitHandler<FieldValues>;
  children: React.ReactNode | ((methods: UseFormReturn) => React.ReactNode);
}

const Form = function Form(props: FormProps) {
  const { resolver, onSubmit, onError, children } = props;
  const methods = useForm({
    mode: 'onBlur',
    resolver,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  );
};

Form.Field = Field;
Form.Register = FormRegister;
Form.Container = Container;
Form.Label = FieldLabel;
// ask reserve space for caption(validation text)?

export default Form;
