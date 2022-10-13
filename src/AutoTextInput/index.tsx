import React from 'react';
import { twMerge } from 'tailwind-merge';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Fuse from 'fuse.js';

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
    onMouseEnter: propsOnMouseEnter,
    onMouseLeave: propsOnMouseLeave,
    value: propsValue,
    ...restProps
  } = props;

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useControl<string>({
    defaultValue: '',
    value: propsValue,
    onChange,
  });

  const [loading, setLoading] = React.useState<boolean>(false);
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

  const unifiedOptions = React.useMemo(
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

  const updateRemoteOptions = React.useCallback(() => {
    setLoading(true);
    onFetch(urlName).then((res: AcceptedOption[]) => {
      setRemoteOptions(
        res.map((option, index) => ({
          id: `remote${index}`,
          content: option,
        }))
      );
      setLoading(false);
    });
  }, [onFetch, urlName]);

  const timeoutID = React.useRef<number>();
  const handleMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      if (propsOnMouseEnter) propsOnMouseEnter(e);
      if (!timeoutID.current && !loading)
        timeoutID.current = window.setTimeout(() => {
          updateRemoteOptions();
        }, 150);
    },
    [propsOnMouseEnter, loading, updateRemoteOptions]
  );
  const handleMouseLeave = React.useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      if (propsOnMouseLeave) propsOnMouseLeave(e);
      if (timeoutID.current) clearTimeout(timeoutID.current);
      timeoutID.current = undefined;
    },
    [propsOnMouseLeave]
  );

  const handleOpenMenu = React.useCallback(() => {
    setOpen(true);
    if (!timeoutID.current && !loading && !open)
      timeoutID.current = window.setTimeout(() => {
        updateRemoteOptions();
      }, 150);
  }, [loading, open, updateRemoteOptions]);

  const filteredOptions = React.useMemo(() => {
    if (!value) return unifiedOptions;
    const fuse = new Fuse(unifiedOptions, { distance: 50, keys: ['value'] });
    return fuse.search(value).map(d => d.item);
  }, [unifiedOptions, value]);
  const [hoveringIndex, setHoveringIndex] = React.useState<number>(0);

  const isCreatable = value && !optionStrings.includes(value);
  const lastCursorPosition = React.useRef({ x: 0, y: 0 });

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={twMerge('w-40 relative group', className)}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
          timeoutID.current = undefined;
        }
      }}
    >
      <TextInput
        ref={ref}
        name={name}
        autoComplete='off'
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
                if (isLastOption)
                  popoverRef.current.scrollTop = nextElement.offsetTop;
                else if (elementBottom > scrollBottom)
                  popoverRef.current.scrollTop =
                    elementBottom - popoverRef.current.clientHeight;
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
                if (isFirstOption)
                  popoverRef.current.scrollTop =
                    nextElement.offsetTop +
                    nextElement.offsetHeight -
                    popoverRef.current.clientHeight;
                else if (popoverRef.current.scrollTop > nextElement.offsetTop)
                  popoverRef.current.scrollTop = nextElement.offsetTop;
              }
              break;
            }
            default:
              // prevent refetch when typing
              timeoutID.current = 9999;
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='w-full'
        {...rest}
        value={value}
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
              onMouseMove={e => {
                if (
                  hoveringIndex !== index &&
                  (lastCursorPosition.current.x !== e.screenX ||
                    lastCursorPosition.current.y !== e.screenY)
                )
                  setHoveringIndex(index);
                lastCursorPosition.current = {
                  x: e.screenX,
                  y: e.screenY,
                };
              }}
              hovering={index === hoveringIndex}
            >
              <div className='flex-1 break-words w-0'>{option.value}</div>
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
