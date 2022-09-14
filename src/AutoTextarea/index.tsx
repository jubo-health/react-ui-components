import React from 'react';
import { twMerge } from 'tailwind-merge';
import { XMarkIcon } from '@heroicons/react/24/solid';

import Textarea from '../Textarea';
import Popover from '../Popover';
import Item from '../Item';
import LoadingIcon from '../icons/LoadingIcon';

type AcceptedOption = string | { [key: string]: string; value: string };
type InternalOption = {
  id: string;
  isDefault?: boolean;
  content: AcceptedOption;
};
export interface AutoTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
  defaultOptions: Array<AcceptedOption>;
  fieldName?: string;
  name?: string;
  value?: string;
  onCreate?: (name: string, value: string) => unknown;
  onDelete?: (name: string, option: AcceptedOption) => unknown;
  onFetch?: (name: string) => Promise<AcceptedOption[]>;
}

const AutoTextFieldContext = React.createContext<
  Required<Pick<AutoTextareaProps, 'onCreate' | 'onDelete' | 'onFetch'>>
>({
  onCreate: () => {},
  onDelete: () => {},
  onFetch: async () => [],
});

export const AutoTextFieldProvider = AutoTextFieldContext.Provider;

const useAutoTextInput = function (
  props: AutoTextareaProps
): Required<Pick<AutoTextareaProps, 'onCreate' | 'onDelete' | 'onFetch'>> {
  const context = React.useContext(AutoTextFieldContext);
  return {
    onCreate: props.onCreate || context.onCreate,
    onDelete: props.onDelete || context.onDelete,
    onFetch: props.onFetch || context.onFetch,
  };
};

const defaultProps = { size: 'lg' } as AutoTextareaProps;

const AutoTextarea = React.forwardRef(function AutoTextareaInner<
  T = AcceptedOption
>(
  props: AutoTextareaProps & typeof defaultProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  const { size, defaultOptions, fieldName, name, className, ...rest } = props;
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = React.useState<boolean>(false);
  const loaded = React.useRef(false);
  const [remoteOptions, setRemoteOptions] = React.useState<InternalOption[]>(
    []
  );
  const { onFetch, onCreate, onDelete } = useAutoTextInput(props);
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
    if (!loaded.current) {
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
  }, [onFetch, urlName]);

  const handleDelete =
    (id: string) => async (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      setRemoteOptions(prev => {
        const index = prev.findIndex(option => option.id === id);
        if (index > -1) {
          onDelete(urlName, prev[index].content);
          return [...prev.slice(0, index).concat(prev.slice(index + 1))];
        }
        return prev;
      });
    };

  return (
    <div
      className={twMerge('w-fit relative group', className)}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <Textarea
        ref={ref}
        value={value}
        onChange={event => {
          setValue(event.target.value);
        }}
        onFocus={handleOpenMenu}
        onClick={handleOpenMenu}
        onKeyDown={handleOpenMenu}
        endAdornment={
          <>
            {loading && <LoadingIcon />}
            <XMarkIcon
              onClick={() => {
                setValue('');
              }}
              className='w-6 h-6 text-grey-700 hidden group-hover:block group-focus-within:block rounded-full hover:bg-grey-300'
            />
          </>
        }
        className={className}
        {...rest}
      />
      {open && (
        <Popover className='w-full max-h-48' tabIndex={0}>
          {simplifiedOptions
            .filter(option => !value || option.value.includes(value))
            .map(option => {
              return (
                <Item
                  key={option.id}
                  checked={option.value === value}
                  onClick={() => {
                    setOpen(false);
                    setValue(option.value);
                  }}
                >
                  <div className='flex-1'>{option.value}</div>
                  {!option.isDefault && (
                    <XMarkIcon
                      onClick={handleDelete(option.id)}
                      className='w-6 h-6 text-grey-700 hover:bg-grey-300 rounded-full sticky right-4'
                    />
                  )}
                </Item>
              );
            })}
          {value && !optionStrings.includes(value) && (
            <Item
              checked
              onClick={() => {
                setOpen(false);
                onCreate(urlName, value);
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
AutoTextarea.defaultProps = defaultProps;

export default AutoTextarea;
