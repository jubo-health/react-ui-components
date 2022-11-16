import React from 'react';
import { twMerge } from 'tailwind-merge';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Fuse from 'fuse.js';
import debounce from 'lodash/debounce';

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
  value: string;
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
  props: Omit<AutoTextInputProps, 'value'>
): Required<Pick<AutoTextInputProps, 'onCreate' | 'onDelete' | 'onFetch'>> {
  const context = React.useContext(AutoTextInputContext);
  return {
    ...props,
    onCreate: props.onCreate || context.onCreate,
    onDelete: props.onDelete || context.onDelete,
    onFetch: props.onFetch || context.onFetch,
  };
};

const defaultProps = {
  size: 'lg',
  defaultOptions: [],
  value: '',
} as AutoTextInputProps;

const virtualizeSize = 20;
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
    value,
    ...restProps
  } = props;

  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = useControl<string>({
  //   defaultValue: '',
  //   value: propsValue,
  //   onChange,
  // });

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

  const handleSelect = React.useCallback(
    (v: string) => {
      setOpen(false);
      if (onChange) onChange(v);
      // setValue(v);
    },
    [onChange]
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

  const [hoveringIndex, setHoveringIndex] = React.useState<number>(0);

  const lastCursorPosition = React.useRef({ x: 0, y: 0 });

  // to filter
  const unifiedOptions = React.useMemo(
    () =>
      options.map(option => ({
        id: option.id,
        isDefault: option.isDefault,
        value:
          typeof option.content === 'string'
            ? option.content
            : option.content.value,
      })),
    [options]
  );

  const filteredOptions: Array<{
    item: typeof unifiedOptions[0];
    score?: number;
  }> = React.useMemo(() => {
    if (!value || typeof value !== 'string')
      return unifiedOptions.map(option => ({ item: option }));

    const exact: Array<{ item: typeof unifiedOptions[0] }> = [];
    const notExact: typeof unifiedOptions = [];
    unifiedOptions.forEach(opt => {
      if (
        opt.value.slice(0, value.length).toLowerCase() === value.toLowerCase()
      )
        exact.push({ item: opt });
      else notExact.push(opt);
    });
    if (exact.length > 19) return exact.slice(0, 20);
    const fuse = new Fuse(notExact, {
      keys: ['value'],
      includeScore: true,
      ignoreLocation: true,
    });
    // only find parts of value to avoid lag causing by long value
    const searchResult = fuse.search(value.slice(0, 30), {
      limit: 20 - exact.length,
    });
    return exact.concat(searchResult);
  }, [unifiedOptions, value]);

  const [displayLength, setDisplayLength] = React.useState(virtualizeSize);
  const inViewRef = React.useRef<HTMLDivElement>(null);
  const isPreviousInView = React.useRef(false);
  React.useEffect(() => {
    if (!inViewRef.current || !open) return () => {};
    const observer = new IntersectionObserver(entries => {
      const isInView = entries.some(entry => entry.isIntersecting);
      if (isInView && !isPreviousInView.current) {
        setDisplayLength(prev => prev + virtualizeSize);
      }
      isPreviousInView.current = isInView;
    });
    observer.observe(inViewRef.current);
    return () => {
      observer.disconnect();
    };
  }, [open, displayLength, filteredOptions.length]); // displayLength in requried to update ref

  const isCreatable = value && filteredOptions[0]?.item.value !== value;
  return (
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
          // setValue(event.target.value, event);
          setDisplayLength(virtualizeSize);
          setHoveringIndex(0);
          if (onChange) onChange(event.target.value, event);
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
                  handleSelect(filteredOptions[hoveringIndex]?.item.value);
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
                  `.${filteredOptions[newIndex]?.item.id || 'create-option'}`
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
                  `.${filteredOptions[newIndex]?.item.id || 'create-option'}`
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
            <Button
              className='hidden rounded-full group-hover:block group-focus-within:block'
              onClick={() => {
                if (onChange) onChange('');
                setDisplayLength(virtualizeSize);
              }}
            >
              <XMarkIcon className='w-4 h-4 text-grey-700' />
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
          {filteredOptions.slice(0, displayLength).map((option, index) => (
            <Item
              ref={index === displayLength - 1 ? inViewRef : undefined}
              key={option.item.id}
              className={option.item.id}
              checked={option.item.value === value}
              onClick={() => {
                handleSelect(option.item.value);
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
              <div className='flex-1 break-words w-0'>{option.item.value}</div>
              {!option.item.isDefault && (
                <Button className='rounded-full sticky right-4'>
                  <XMarkIcon
                    onClick={handleDelete(option.item.id)}
                    className='w-4 h-4'
                  />
                </Button>
              )}
            </Item>
          ))}
          {isCreatable && (
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
