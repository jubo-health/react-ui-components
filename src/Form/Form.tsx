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
  caption?: string;
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
    caption,
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
        'form-component [&>*]:w-full grow-[2] shrink basis-40',
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
      {errors[name] || caption ? (
        <StatusCaption
          status={errors[name] ? 'error' : 'default'}
          className={twMerge('ErrorCaption')}
        >
          {errors[name] ? errors[name]?.message || '請輸入必填欄位' : caption}
        </StatusCaption>
      ) : null}
    </div>
  );
}

const DEFAULT_FRAGMENT = 'div';
function Fragment<
  BaseElement extends React.ElementType = typeof DEFAULT_FRAGMENT
>({ className, as, ...props }: AsProps<BaseElement> & PropsOf<BaseElement>) {
  return React.createElement(as || DEFAULT_FRAGMENT, {
    className: twMerge('col-span-full', className),
    ...props,
  });
}

const RequiredIcon = () => (
  <span className='FieldLabel-require relative'>
    <div className='absolute inline w-1.5 h-1.5 bg-secondary rounded-full ml-1' />
  </span>
);

const FieldLabel = ({ className, ...rest }: LabelProps) => (
  <Label
    className={twMerge('form-component flex-1 basis-32 min-w-[20%]', className)}
    {...rest}
  />
);

interface FieldOnlyProps extends Omit<LabelProps, 'children'> {
  name: string;
  label?: string | React.ReactNode;
  /**
   * Label 底下的文字備註
   */
  note?: string | React.ReactNode;
  /**
   * Input 底下的文字備註，會被驗證覆蓋
   */
  caption?: string;
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
  const { name, required, label, note, caption, ...rest } = props;

  return (
    <>
      <FieldLabel note={note}>
        {label || name}
        {required && <RequiredIcon />}
      </FieldLabel>
      <Input name={name} required={required} caption={caption} {...rest} />
    </>
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
      <form
        // experimental
        className='sm:grid sm:grid-cols-[minmax(20%,_auto)_minmax(35%,_1fr)]'
        onSubmit={handleSubmit(onSubmit)}
        {...rest}
      >
        {children}
      </form>
    </FormProvider>
  );
};

Form.Field = Field;
Form.Label = FieldLabel;
Form.Input = Input;
Form.RequiredIcon = RequiredIcon;
Form.Fragment = Fragment;
// ask reserve space for caption(validation text)?

export default Form;
