import React from 'react';
import {
  useForm,
  useFormContext,
  UseFormMethods,
  FormProvider,
  Resolver,
  SubmitHandler,
  FieldValues,
  RegisterOptions,
  Controller,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import Textarea from '../Textarea';
import { PropsOf, AsProps } from '../types';
import StatusCaption from './StatusCaption';

const DEFAULT_BASE = Textarea;

interface FormRegisterProps extends RegisterOptions {
  name: string;
  className?: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormRegisterContext = React.createContext<
  Omit<FormRegisterProps, 'children'>
>({ name: '' });

const FormRegister = (props: FormRegisterProps) => {
  const { className, children, ...rest } = props;
  const { current: value } = React.useRef(rest);
  return (
    <FormRegisterContext.Provider value={value}>
      <div className={twMerge('FormRegister flex-1 [&>*]:w-full', className)}>
        {children}
      </div>
    </FormRegisterContext.Provider>
  );
};

export type FieldInputProps<BaseElement> = AsProps<BaseElement> &
  Omit<PropsOf<BaseElement>, 'value'>;

function FieldInput<
  BaseElement extends React.ElementType = typeof DEFAULT_BASE
>(props: FieldInputProps<BaseElement>) {
  const { as, defaultValue, ...rest } = props;
  const { name, required, ...options } = React.useContext(FormRegisterContext);

  const { register } = useFormContext();

  // the callback return "true" indicate valid
  const rules = React.useMemo(
    () => ({
      validate: {
        required: (d: any) =>
          !required ||
          (d && typeof d === 'object'
            ? Object.keys(d).length > 0
            : Boolean(d) || d === 0 || d === false),
      },
    }),
    [required]
  );
  const { errors } = useFormContext();

  const component = as || DEFAULT_BASE;
  return (
    component as typeof component & {
      registrable?: boolean;
    }
  ).registrable ? (
    React.createElement(component, {
      ...rest,
      status: errors[name] ? 'error' : undefined,
      name,
      ref: register(rules),
    })
  ) : (
    <Controller
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      render={({ ...params }) =>
        React.createElement(component, {
          status: errors[name] ? 'error' : undefined,
          defaultValue,
          ...rest,
          ...params,
        })
      }
    />
  );
}

const ErrorCaption = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const { name } = React.useContext(FormRegisterContext);
  const { errors } = useFormContext();

  return (
    <StatusCaption
      status='error'
      className={twMerge('ErrorCaption', className)}
    >
      {errors[name] ? errors[name]?.message || '請輸入必填欄位' : children}
    </StatusCaption>
  );
};

FormRegister.Input = FieldInput;
FormRegister.ErrorCaption = ErrorCaption;

const Container = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('sm:flex', className)} {...props} />
);

interface FieldLabelProps {
  children: React.ReactNode;
  required?: boolean;
  sublabel?: string;
}

const FieldLabel = (props: FieldLabelProps) => {
  const { children, required, sublabel } = props;

  return (
    <div className='FieldLabel-wrapper'>
      <div className='FieldLabel whitespace-prewrap break-words w-32 mr-4 text-lg leading-6 pt-2 pb-1 capitalize'>
        {children}
        {required && (
          <span className='FieldLabel-require relative'>
            <div className='absolute inline w-1.5 h-1.5 bg-secondary rounded-full ml-1' />
          </span>
        )}
      </div>
      <div className='FieldLabel-sublabel text-xs text-grey-500'>
        {sublabel}
      </div>
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
  Omit<PropsOf<BaseElement>, 'value'> &
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
      <FormRegister name={name} required={required}>
        <FormRegister.Input as={as} {...(rest as PropsOf<BaseElement>)} />
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
  children: React.ReactNode | ((methods: UseFormMethods) => React.ReactNode);
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
