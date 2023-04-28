// !!!!! using register would lead to the web stuck when submmitting with setState
// !!!!! I have not figure out the root cause which cannot be reproduce in codesandbox (https://codesandbox.io/s/react-hook-form-get-started-forked-ohvrve?file=/src/index.js)
// !!!!! so avoid using register in this version

import React from 'react';
import {
  useForm as useHookForm,
  useFormContext as useHookFormContext,
  UseFormReturn as UseHookFormReturn,
  UseFormProps,
  FormProvider as HookFormProvider,
  FormProviderProps as HookFormProviderProps,
  SubmitHandler,
  FieldValues,
  Controller,
  useFormState,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import Label, { LabelProps } from '../Label';

import Textarea from '../Textarea';
import { PropsOf, AsProps } from '../types';
import StatusCaption from './StatusCaption';

const DEFAULT_BASE = Textarea;

interface ExtendedMethods<T> {
  mount: (key: keyof T) => void;
  unmount: (key: keyof T) => void;
}

interface UseFormMethods<T extends FieldValues = FieldValues>
  extends UseHookFormReturn<T>,
    ExtendedMethods<T> {}

const useFormContext = useHookFormContext as <
  TFieldValues extends Record<string, any>
>() => UseFormMethods<TFieldValues>;

type FormProviderProps<T extends FieldValues> = HookFormProviderProps<T> &
  ExtendedMethods<T>;
const FormProvider = HookFormProvider as <
  TFieldValues extends Record<string, any>
>({
  children,
  ...props
}: FormProviderProps<TFieldValues>) => JSX.Element;

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

  const { mount, unmount } = useFormContext();
  const { errors } = useFormState();

  React.useEffect(() => {
    mount(name);
    return () => {
      unmount(name);
    };
  }, [mount, name, unmount]);

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

  const component = as || DEFAULT_BASE;
  return (
    <div
      className={twMerge(
        'form-component [&>*]:w-full grow-[2] shrink basis-40',
        className
      )}
    >
      <Controller
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        render={({
          field: { value, onChange: inputChange, onBlur: inputBlur },
        }) =>
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
            value,
          })
        }
      />
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
}

export type FieldProps<BaseElement> = InputProps<BaseElement> & FieldOnlyProps;

const Field = <BaseElement extends React.ElementType = typeof DEFAULT_BASE>(
  props: FieldProps<BaseElement>
) => {
  const { name, required, label, note } = props;

  return (
    <>
      <FieldLabel note={note}>
        {label || name}
        {required && <RequiredIcon />}
      </FieldLabel>
      <Input {...props} />
    </>
  );
};

export type FormProps = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> &
  UseFormMethods & {
    onSubmit: SubmitHandler<FieldValues>;
    children:
      | React.ReactNode
      | ((methods: UseHookFormReturn) => React.ReactNode);
  };

const Form = function Form(props: FormProps) {
  const {
    watch,
    getValues,
    getFieldState,
    setError,
    clearErrors,
    setValue,
    trigger,
    formState,
    resetField,
    reset,
    handleSubmit,
    unregister,
    control,
    register,
    setFocus,
    mount,
    unmount,
    onSubmit,
    children,
    ...rest
  } = props;

  return (
    <FormProvider
      watch={watch}
      getValues={getValues}
      getFieldState={getFieldState}
      setError={setError}
      clearErrors={clearErrors}
      setValue={setValue}
      trigger={trigger}
      formState={formState}
      resetField={resetField}
      reset={reset}
      handleSubmit={handleSubmit}
      unregister={unregister}
      control={control}
      register={register}
      setFocus={setFocus}
      mount={mount}
      unmount={unmount}
    >
      <form
        // experimental
        className='sm:grid sm:grid-cols-[minmax(20%,_auto)_minmax(35%,_1fr)] sm:gap-y-6'
        onSubmit={handleSubmit(onSubmit)}
        {...rest}
      >
        {children}
      </form>
    </FormProvider>
  );
};

function useForm<T extends FieldValues = FieldValues>(
  params: Omit<UseFormProps<T>, 'shouldUnregister'>
) {
  // using register may lead to some bug, so I remove it. Detail showed in the top of this file.
  const { register, ...methods } = useHookForm<T>({
    ...params,
    shouldUnregister: false,
  });
  const revisedMethods = React.useRef<null | Pick<
    UseFormMethods<T>,
    'handleSubmit' | 'mount' | 'unmount'
  >>(null);
  const { current: mounted } = React.useRef<Set<keyof T>>(new Set());

  if (!revisedMethods.current) {
    const handleSubmit: UseHookFormReturn<T>['handleSubmit'] = (
      onValid,
      onInValid
    ) => {
      const filteredOnValid: typeof onValid = fieldValues => {
        const filteredValues = Object.fromEntries(
          Object.entries(fieldValues).filter(([key]) => mounted.has(key))
        ) as typeof fieldValues;
        onValid(filteredValues);
      };
      return methods.handleSubmit(filteredOnValid, onInValid);
    };
    revisedMethods.current = {
      handleSubmit,
      mount: (key: keyof T) => {
        mounted.add(key);
      },
      unmount: (key: keyof T) => {
        mounted.delete(key);
      },
    };
  }

  return { ...methods, ...revisedMethods.current };
}

Form.Field = Field;
Form.Label = FieldLabel;
Form.Input = Input;
Form.RequiredIcon = RequiredIcon;
Form.Fragment = Fragment;
// ask reserve space for caption(validation text)?

export * from 'react-hook-form';
export {
  type UseFormMethods,
  type FormProviderProps,
  FormProvider,
  useFormContext,
  useForm,
};
export default Form;
