import React from 'react';
import { twMerge } from 'tailwind-merge';
import { XMarkIcon } from '@heroicons/react/24/solid';

import TextInput, { TextInputProps } from '../TextInput';
import Popover from '../Popover';
import Item from '../Item';
import LoadingIcon from '../icons/LoadingIcon';
import useControl from '../hooks/useControl';
import Button from '../Button';

type AcceptedOption = string | { [key: string]: string; value: string };
type InternalOption = {
  id: string;
  isDefault?: boolean;
  content: AcceptedOption;
};
export interface AutoTextInputProps
  extends Omit<TextInputProps, 'size' | 'onChange'> {
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
  const popoverRef = React.useRef<HTMLDivElement>(null);
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

  const handleSelect = React.useCallback(
    (v: string) => {
      setOpen(false);
      setValue(v);
    },
    [setValue]
  );

  const handleCreate = React.useCallback(() => {
    setOpen(false);
    setLoading(true);
    onCreate(urlName, value).then(() => {
      setLoading(false);
    });
    setRemoteOptions(prev => [
      ...prev,
      { id: `remote${prev.length}`, content: value },
    ]);
  }, [onCreate, urlName, value]);

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
  const [hoveringIndex, setHoveringIndex] = React.useState<number>(0);

  const isCreatable = value && !optionStrings.includes(value);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={twMerge('w-40 relative group', className)}
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
          switch (e.key) {
            case 'Enter':
              if (hoveringIndex !== -1) {
                e.preventDefault();
                if (hoveringIndex === filteredOptions.length) {
                  handleCreate();
                } else {
                  handleSelect(filteredOptions[hoveringIndex]?.value);
                }
              }
              break;
            case 'ArrowDown': {
              const isLastOption = isCreatable
                ? hoveringIndex === filteredOptions.length
                : hoveringIndex === filteredOptions.length - 1;
              const newIndex = isLastOption ? 0 : hoveringIndex + 1;
              setHoveringIndex(newIndex);
              const nextElement: HTMLDivElement | undefined | null =
                popoverRef.current?.querySelector(
                  `.${filteredOptions[newIndex]?.id || 'create-option'}`
                );
              if (popoverRef.current && nextElement) {
                const scrollBottom =
                  popoverRef.current.clientHeight +
                  popoverRef.current.scrollTop;
                const elementBottom =
                  nextElement.offsetTop + nextElement.offsetHeight;
                if (isLastOption) nextElement.scrollIntoView();
                else if (elementBottom > scrollBottom)
                  nextElement.scrollIntoView(isLastOption);
              }
              break;
            }
            case 'ArrowUp': {
              const isFirstOption = hoveringIndex === 0;
              const newIndex = isFirstOption
                ? isCreatable
                  ? filteredOptions.length
                  : filteredOptions.length - 1
                : hoveringIndex - 1;
              setHoveringIndex(newIndex);
              const nextElement: HTMLDivElement | undefined | null =
                popoverRef.current?.querySelector(
                  `.${filteredOptions[newIndex]?.id || 'create-option'}`
                );
              if (popoverRef.current && nextElement) {
                if (isFirstOption) nextElement.scrollIntoView(false);
                else if (popoverRef.current.scrollTop > nextElement.offsetTop)
                  nextElement.scrollIntoView();
              }
              break;
            }
            default:
              handleOpenMenu();
          }
        }}
        endAdornment={
          <>
            {loading && <LoadingIcon />}
            <Button className='hidden rounded-full group-hover:block group-focus-within:block'>
              <XMarkIcon
                onClick={() => {
                  setValue('');
                }}
                className='w-4 h-4 text-grey-700'
              />
            </Button>
          </>
        }
        className='w-full'
        {...rest}
      />
      {open && (
        <Popover className='w-full max-h-48' tabIndex={0} ref={popoverRef}>
          {filteredOptions.map((option, index) => (
            <Item
              key={option.id}
              className={option.id}
              checked={option.value === value}
              onClick={() => {
                handleSelect(option.value);
              }}
              onMouseEnter={() => {
                setHoveringIndex(index);
              }}
              hovering={index === hoveringIndex}
            >
              <div className='flex-1'>{option.value}</div>
              {!option.isDefault && (
                <Button className='rounded-full sticky right-4'>
                  <XMarkIcon
                    onClick={handleDelete(option.id)}
                    className='w-4 h-4'
                  />
                </Button>
              )}
            </Item>
          ))}
          {value && !optionStrings.includes(value) && (
            <Item
              className='create-option'
              hovering={hoveringIndex === filteredOptions.length}
              onClick={handleCreate}
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
