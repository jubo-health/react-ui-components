import React from 'react';
import { twMerge } from 'tailwind-merge';
import { XMarkIcon } from '@heroicons/react/24/solid';

import Textarea from '../Textarea';
import Popover from '../Popover';
import Item from '../Item';
import LoadingIcon from '../icons/LoadingIcon';

type Option = { value: string; label: string };
type AcceptedOption = string | Option;
export interface AutoTextareaProps<T extends AcceptedOption = string>
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
  defaultOptions: Array<T>;
  fieldName?: string;
  name?: string;
  value?: string;
  onCreate?: (name: string, value: string) => unknown;
  onDelete?: (name: string, id: string) => unknown;
  onFetch?: (name: string) => Promise<string[]>;
}

const AutoTextFieldContext = React.createContext<
  Required<Pick<AutoTextareaProps, 'onCreate' | 'onDelete' | 'onFetch'>>
>({
  onCreate: () => {},
  onDelete: () => {},
  onFetch: async () => [],
});

export const AutoTextFieldProvider = AutoTextFieldContext.Provider;

const useAutoTextInput = (
  props: AutoTextareaProps
): Required<Pick<AutoTextareaProps, 'onCreate' | 'onDelete' | 'onFetch'>> => {
  const context = React.useContext(AutoTextFieldContext);
  return {
    onCreate: props.onCreate || context.onCreate,
    onDelete: props.onDelete || context.onDelete,
    onFetch: props.onFetch || context.onFetch,
  };
};

const defaultProps = { size: 'lg' } as AutoTextareaProps;

const AutoTextarea = React.forwardRef(function AutoTextareaInner<
  T extends AcceptedOption = string
>(
  props: AutoTextareaProps<T> & typeof defaultProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  const { size, defaultOptions, fieldName, name, ...rest } = props;
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [remoteOptions, setRemoteOptions] = React.useState<string[]>([]);
  const { onFetch, onCreate, onDelete } = useAutoTextInput(props);
  const urlName = fieldName || name || '';

  const options = React.useMemo(
    () =>
      [...defaultOptions, ...remoteOptions].map(option =>
        typeof option === 'string'
          ? { value: option, label: option }
          : (option as Option)
      ),
    [defaultOptions, remoteOptions]
  );

  const handleOpenMenu = React.useCallback(() => {
    setOpen(true);
    setLoading(true);
    onFetch(urlName).then((res: string[]) => {
      setRemoteOptions(res);
      setLoading(false);
    });
  }, [onFetch, urlName]);

  const handleDelete = async (v: string) => {
    onDelete(urlName, v);
    setRemoteOptions(prev => {
      const index = prev.findIndex(option => option === v);
      return index !== -1
        ? prev.slice(0, index).concat(prev.slice(index + 1))
        : prev;
    });
  };

  return (
    <div
      className='w-fit relative group'
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
        endAdornment={
          <>
            {loading && <LoadingIcon />}
            <XMarkIcon
              onClick={() => {
                setValue('');
              }}
              className='w-6 h-6 text-grey-700 hidden group-hover:block group-focus:block rounded-full hover:bg-grey-300'
            />
          </>
        }
      />
      {open && (
        <Popover className='w-full' tabIndex={0}>
          {options.map(option => (
            <Item
              key={option.value}
              className='hover:bg-grey-300'
              onClick={() => {
                setOpen(false);
                setValue(option.value);
              }}
              onMouseDown={e => {
                e.preventDefault();
              }}
            >
              {option.label}
            </Item>
          ))}
        </Popover>
      )}
    </div>
  );
});
AutoTextarea.defaultProps = defaultProps;

export default AutoTextarea;
