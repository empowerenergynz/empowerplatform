import { SpaceProps } from '@chakra-ui/react';

export const MARGIN_PROPS: (keyof SpaceProps)[] = [
  'mt',
  'mb',
  'ml',
  'mr',
  'mx',
  'my',
  'm',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginX',
  'marginY',
  'margin',
  'pt',
  'pb',
  'pl',
  'pr',
  'px',
  'py',
  'p',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingX',
  'paddingY',
  'padding',
];

function useExtractProps<T>(props: T, keys: (keyof T)[]) {
  const newProps = { ...props };
  const extractedProps: Partial<T> = {};
  for (const key of keys) {
    extractedProps[key] = props[key];
    delete newProps[key];
  }
  return { newProps, extractedProps };
}

export default useExtractProps;
