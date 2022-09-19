import React from 'react';
import { twMerge } from 'tailwind-merge';
import { XMarkIcon } from '@heroicons/react/24/solid';

import TextInput from '../TextInput';
import Popover from '../Popover';
import Item from '../Item';
import LoadingIcon from '../icons/LoadingIcon';
import useControl from '../hooks/useControl';

type AcceptedOption = string | { [key: string]: string; value: string };
type InternalOption = {
  id: string;
  isDefault?: boolean;
  content: AcceptedOption;
};
export interface AutoTextInputProps
  extends Omit<React.HTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
  defaultOptions?: Array<AcceptedOption>;
  fieldName?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (state: string, event?: React.FormEvent<HTMLInputElement>) => void;
  onCreate?: (name: string, value: string) => Promise<unknown>;
  onDelete?: (name: string, option: AcceptedOption) => Promise<unknown>;
  onFetch?: (name: string) => Promise<AcceptedOption[]>;
}

const AutoTextInputContext = React.createContext<
  Required<Pick<AutoTextInputProps, 'onCreate' | 'onDelete' | 'onFetch'>>
>({
  onCreate: async () => {},
  onDelete: async () => {},
  onFetch: async () => [],
});

export const AutoTextInputProvider = AutoTextInputContext.Provider;

const useAutoTextInput = function (
  props: AutoTextInputProps
): Required<Pick<AutoTextInputProps, 'onCreate' | 'onDelete' | 'onFetch'>> {
  const context = React.useContext(AutoTextInputContext);
  return {
    ...props,
    onCreate: props.onCreate || context.onCreate,
    onDelete: props.onDelete || context.onDelete,
    onFetch: props.onFetch || context.onFetch,
  };
};

const defaultProps = { size: 'lg', defaultOptions: [] } as AutoTextInputProps;

const AutoTextInput = React.forwardRef(function AutoTextInputInner<
  T = AcceptedOption
>(
  props: AutoTextInputProps & typeof defaultProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const {
    size,
    defaultOptions,
    fieldName,
    name,
    className,
    onChange,
    ...restProps
  } = props;

  const [value, setValue] = useControl<string>({
    defaultValue: '',
    onChange,
    ...props,
  });
  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = React.useState<boolean>(false);
  const loaded = React.useRef(false);
  const [remoteOptions, setRemoteOptions] = React.useState<InternalOption[]>(
    []
  );
  const { onFetch, onCreate, onDelete, ...rest } = useAutoTextInput(restProps);
  const urlName = fieldName || name || '';

  const options: InternalOption[] = React.useMemo(
    () =>
      (
        (defaultOptions || []).map((option, index) => ({
          id: `default${index}`,
          content: option,
          isDefault: true,
        })) as InternalOption[]
      ).concat(remoteOptions),
    [defaultOptions, remoteOptions]
  );

  const optionStrings = React.useMemo(
    () =>
      options.map(o =>
        typeof o.content === 'string' ? o.content : o.content.value
      ),
    [options]
  );

  const simplifiedOptions = React.useMemo(
    () =>
      options.map(option => ({
        ...option,
        value:
          typeof option.content === 'string'
            ? option.content
            : option.content.value,
      })),
    [options]
  );

  const handleOpenMenu = React.useCallback(() => {
    setOpen(true);
    // FIXME: maybe this should be set by user by using cache or something else
    if (!loaded.current && !loading) {
      setLoading(true);
      onFetch(urlName).then((res: AcceptedOption[]) => {
        setRemoteOptions(
          res.map((option, index) => ({
            id: `remote${index}`,
            content: option,
          }))
        );
        setLoading(false);
        loaded.current = true;
      });
    }
  }, [onFetch, urlName, loading]);

  const handleDelete =
    (id: string) => async (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      setLoading(true);
      setRemoteOptions(prev => {
        const index = prev.findIndex(option => option.id === id);
        if (index > -1) {
          onDelete(urlName, prev[index].content).then(() => {
            setLoading(false);
          });
          return [...prev.slice(0, index).concat(prev.slice(index + 1))];
        }
        return prev;
      });
    };

  const filteredOptions = React.useMemo(
    () =>
      simplifiedOptions.filter(
        option => !value || option.value.includes(value)
      ),
    [simplifiedOptions, value]
  );
  const nextItemRef = React.useRef<HTMLDivElement>(null);
  const lastItemRef = React.useRef<HTMLDivElement>(null);
  const [hoveringIndex, setHoveringIndex] = React.useState<number>(0);

  return (
    <div
      className={twMerge('w-fit relative group', className)}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <TextInput
        ref={ref}
        value={value}
        onChange={event => {
          setValue(event.target.value, event);
        }}
        onFocus={handleOpenMenu}
        onClick={handleOpenMenu}
        onKeyDown={e => {
          switch (e.key.toLowerCase()) {
            case 'enter':
              setOpen(false);
              if (hoveringIndex !== -1)
                setValue(filteredOptions[hoveringIndex]?.value);
              break;
            case 'arrowdown':
              setHoveringIndex(prev =>
                prev === filteredOptions.length - 1 ? prev : prev + 1
              );
              nextItemRef.current?.scrollIntoView(false);
              break;
            case 'arrowup':
              setHoveringIndex(prev => (prev === 0 ? 0 : prev - 1));
              lastItemRef.current?.scrollIntoView();
              break;
            default:
              handleOpenMenu();
          }
        }}
        endAdornment={
          <>
            {loading && <LoadingIcon />}
            <XMarkIcon
              onClick={() => {
                setValue('');
              }}
              className='p-1 w-6 h-6 text-grey-700 hidden group-hover:block group-focus-within:block rounded-full hover:bg-grey-300'
            />
          </>
        }
        className={twMerge('w-40', className)}
        {...rest}
      />
      {open && (
        <Popover className='w-full max-h-48' tabIndex={0}>
          {filteredOptions.map((option, index) => (
            <Item
              key={option.id}
              checked={option.value === value}
              onClick={() => {
                setOpen(false);
                setValue(option.value);
              }}
              onMouseEnter={() => {
                setHoveringIndex(index);
              }}
              hovering={index === hoveringIndex}
              ref={
                index === hoveringIndex + 1
                  ? nextItemRef
                  : index === hoveringIndex - 1
                  ? lastItemRef
                  : undefined
              }
            >
              <div className='flex-1'>{option.value}</div>
              {!option.isDefault && (
                <XMarkIcon
                  onClick={handleDelete(option.id)}
                  className='p-0.5 w-6 h-6 text-grey-700 hover:bg-grey-300 rounded-full sticky right-4'
                />
              )}
            </Item>
          ))}
          {value && !optionStrings.includes(value) && (
            <Item
              checked
              onClick={() => {
                setOpen(false);
                setLoading(true);
                onCreate(urlName, value).then(() => {
                  setLoading(false);
                });
                setRemoteOptions(prev => [
                  ...prev,
                  { id: `remote${prev.length}`, content: value },
                ]);
              }}
            >
              新增 {value}
            </Item>
          )}
        </Popover>
      )}
    </div>
  );
});
AutoTextInput.defaultProps = defaultProps;

export default AutoTextInput;
