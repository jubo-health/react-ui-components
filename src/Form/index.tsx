import React from 'react';
import {
  useFormContext,
  UseFormMethods,
  FormProvider,
  SubmitHandler,
  FieldValues,
  Controller,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import Label, { LabelProps } from '../Label';

import Textarea from '../Textarea';
import { PropsOf, AsProps } from '../types';
import StatusCaption from './StatusCaption';

const DEFAULT_BASE = Textarea;

interface InputOnlyProps {
  name: string;
  required?: boolean;
  className?: string;
  defaultValue?: unknown;
}

export type InputProps<BaseElement> = AsProps<BaseElement> &
  Omit<PropsOf<BaseElement>, 'value'> &
  InputOnlyProps;

function Input<BaseElement extends React.ElementType = typeof DEFAULT_BASE>(
  props: InputProps<BaseElement>
) {
  const {
    as,
    name,
    required,
    defaultValue,
    className,
    onChange,
    onBlur,
    ...rest
  } = props;

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
    <div
      className={twMerge(
        'FormRegister [&>*]:w-full grow-[2] shrink basis-40',
        className
      )}
    >
      {(
        component as typeof component & {
          registrable?: boolean;
        }
      ).registrable ? (
        React.createElement(component, {
          ...rest,
          status: errors[name] ? 'error' : undefined,
          name,
          onChange,
          onBlur,
          ref: register(rules),
        })
      ) : (
        <Controller
          name={name}
          defaultValue={defaultValue}
          rules={rules}
          render={({ onChange: inputChange, onBlur: inputBlur, ...params }) =>
            React.createElement(component, {
              status: errors[name] ? 'error' : undefined,
              defaultValue,
              onChange: (...p: any[]) => {
                inputChange(...p);
                if (onChange) onChange(...p);
              },
              onBlur: () => {
                inputBlur();
                if (onBlur) onBlur();
              },
              ...rest,
              ...params,
            })
          }
        />
      )}
      {errors[name] ? (
        <StatusCaption status='error' className={twMerge('ErrorCaption')}>
          {errors[name]?.message || '請輸入必填欄位'}
        </StatusCaption>
      ) : null}
    </div>
  );
}

const Container = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('sm:flex', className)} {...props} />
);

const RequiredIcon = () => (
  <span className='FieldLabel-require relative'>
    <div className='absolute inline w-1.5 h-1.5 bg-secondary rounded-full ml-1' />
  </span>
);

const FieldLabel = ({ className, ...rest }: LabelProps) => (
  <Label
    className={twMerge('flex-1 basis-32 sm:max-w-[25%] min-w-[20%]', className)}
    {...rest}
  />
);

interface FieldOnlyProps extends Omit<LabelProps, 'children'> {
  name: string;
  label?: string;
  required?: boolean;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
}

export type FieldProps<BaseElement> = AsProps<BaseElement> &
  Omit<PropsOf<BaseElement>, 'value'> &
  FieldOnlyProps;

const Field = <BaseElement extends React.ElementType = typeof DEFAULT_BASE>(
  props: FieldProps<BaseElement>
) => {
  const { name, required, label, note, ...rest } = props;

  return (
    <Container>
      <FieldLabel note={note}>
        {label || name}
        {required && <RequiredIcon />}
      </FieldLabel>
      <Input name={name} required={required} {...rest} />
    </Container>
  );
};

export type FormProps = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> &
  UseFormMethods & {
    onSubmit: SubmitHandler<FieldValues>;
    children: React.ReactNode | ((methods: UseFormMethods) => React.ReactNode);
  };

const Form = function Form(props: FormProps) {
  const {
    onSubmit,
    children,
    register,
    unregister,
    formState,
    watch,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    getValues,
    trigger,
    control,
    errors,
    ...rest
  } = props;

  return (
    <FormProvider
      register={register}
      unregister={unregister}
      formState={formState}
      watch={watch}
      handleSubmit={handleSubmit}
      reset={reset}
      setError={setError}
      clearErrors={clearErrors}
      setValue={setValue}
      getValues={getValues}
      trigger={trigger}
      control={control}
      errors={errors}
    >
      <form onSubmit={handleSubmit(onSubmit)} {...rest}>
        {children}
      </form>
    </FormProvider>
  );
};

Form.Field = Field;
Form.Label = FieldLabel;
Form.Input = Input;
Form.Container = Container;
// ask reserve space for caption(validation text)?

export default Form;
