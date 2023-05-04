/* eslint-disable no-underscore-dangle */
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
  useWatch as useHookFormWatch,
  useFormState,
  UseFormGetValues,
  FieldPath,
  FieldPathValue,
  Control as HookFormControl,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import get from 'lodash/get';
import set from 'lodash/set';

import Label, { LabelProps } from '../Label';

import Textarea from '../Textarea';
import { PropsOf, AsProps } from '../types';
import StatusCaption from './StatusCaption';

const DEFAULT_BASE = Textarea;

interface ExtendedMethods<T extends FieldValues> {
  mount: (key: FieldPath<T>) => void;
  unmount: (key: FieldPath<T>) => void;
}

interface UseFormMethods<T extends FieldValues = FieldValues>
  extends Omit<UseHookFormReturn<T>, 'register' | 'watch'>,
    ExtendedMethods<T> {
  control: Control<T>;
}

interface Control<TFieldValues extends Record<string, any>>
  extends HookFormControl<TFieldValues> {
  _watching: Array<{ trigger: (k: string) => void }>;
  _mounted: Set<any>;
}

const useFormContext = useHookFormContext as unknown as <
  TFieldValues extends Record<string, any>
>() => UseFormMethods<TFieldValues> & {
  control: Control<TFieldValues>;
};

type FormProviderProps<T extends FieldValues> = Omit<
  HookFormProviderProps<T>,
  'register' | 'watch'
> &
  ExtendedMethods<T>;
const FormProvider = HookFormProvider as unknown as <
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

  const { mount, unmount, control } = useFormContext();
  const { errors } = useFormState();

  React.useEffect(() => {
    mount(name);
    control._watching.forEach((d: any) => d.trigger(name));
    return () => {
      unmount(name);
      control._watching.forEach((d: any) => d.trigger(name));
    };
  }, [mount, name, unmount, control]);

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
    setFocus,
    mount,
    unmount,
    onSubmit,
    children,
    ...rest
  } = props;

  return (
    <FormProvider
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

function reviseByMounted<
  FieldValues extends Record<string, any>,
  P extends FieldPath<FieldValues>
>(
  data: Record<string, any> | any[],
  mounted: Set<P>,
  names?: FieldPath<FieldValues> | readonly FieldPath<FieldValues>[]
) {
  if (typeof names === 'undefined') {
    const filteredValues = {};
    mounted.forEach(key => set(filteredValues, key, get(data, key)));
    return filteredValues as FieldPathValue<FieldValues, P>;
  }

  if (typeof names === 'string')
    return mounted.has(names as any) ? data : undefined;

  return data.map((v: any, i: number) =>
    mounted.has(names[i] as any) ? v : undefined
  ) as any;
}

function useForm<TFieldValues extends FieldValues = FieldValues>(
  params: Omit<UseFormProps<TFieldValues>, 'shouldUnregister'>
) {
  // using register may lead to some bug, so I remove it. Detail showed in the top of this file.
  // also remove watch for better performance and maintainance. Use useWatch instead.
  const { register, watch, ...methods } = useHookForm<TFieldValues>({
    ...params,
    shouldUnregister: false,
  });
  const revisedMethods = React.useRef<null | Pick<
    UseFormMethods<TFieldValues>,
    'handleSubmit' | 'getValues' | 'mount' | 'unmount'
  >>(null);

  if (!revisedMethods.current) {
    const control = methods.control as Control<TFieldValues>;
    control._mounted = new Set();
    control._watching = [];
    const handleSubmit: UseHookFormReturn<TFieldValues>['handleSubmit'] = (
      onValid,
      onInValid
    ) => {
      const filteredOnValid: typeof onValid = fieldValues => {
        // FIXME: useFieldArray
        const filteredValues = reviseByMounted(fieldValues, control._mounted);
        onValid(filteredValues as typeof fieldValues);
      };
      return methods.handleSubmit(filteredOnValid, onInValid);
    };
    const getValues: UseFormGetValues<TFieldValues> = (
      names?: FieldPath<TFieldValues> | ReadonlyArray<FieldPath<TFieldValues>>
    ) => {
      return reviseByMounted(
        methods.getValues(names as any),
        control._mounted,
        names
      );
    };
    revisedMethods.current = {
      handleSubmit,
      getValues,
      mount: (key: FieldPath<TFieldValues>) => {
        control._mounted.add(key);
        control._mounted = new Set(control._mounted); // intend to trigger re-calculation in useWatch
      },
      unmount: (key: FieldPath<TFieldValues>) => {
        control._mounted.delete(key);
        control._mounted = new Set(control._mounted); // intend to trigger re-calculation in useWatch
      },
    };
  }

  return {
    ...methods,
    ...revisedMethods.current,
  } as UseFormMethods<TFieldValues>;
}

function useWatch(props?: any) {
  const { current: name } = React.useRef(props?.name);
  const [, setRenderCounts] = React.useState(0);
  const methods = useFormContext();
  const result = useHookFormWatch(props);
  const { control = methods.control } = props || {};

  React.useEffect(() => {
    const trigger = (updatingName: string) => {
      if (
        !name ||
        name === updatingName ||
        (Array.isArray(name) && name.includes(updatingName))
      )
        setRenderCounts(prev => prev + 1);
    };
    control._watching.push({ trigger });
    return () => {
      control._watching = control._watching.filter(
        (obj: any) => obj.trigger !== trigger
      );
    };
  }, [control, name]);

  return React.useMemo(
    () => reviseByMounted(result, control._mounted, name),
    [control._mounted, name, result]
  );
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
  useWatch,
  useForm,
};
export default Form;
