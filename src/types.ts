/** 參考 headless ui 做的 https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-react/src/types.ts */
export type PropsOf<BasicElement = 'div'> =
  BasicElement extends React.ElementType
    ? React.ComponentProps<BasicElement>
    : never;

export type AsProps<BasicElement> = {
  as?: BasicElement;
};

export type MutuallyExclude<T, E extends keyof T> = {
  [K in E]: { [P in K]: T[P] } & {
    [P in Exclude<E, K>]?: never;
  } & Omit<T, E>;
}[E];
