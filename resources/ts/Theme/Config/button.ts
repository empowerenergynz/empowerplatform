/* eslint-disable @typescript-eslint/naming-convention */

const button = {
  variants: {
    solidPrimary: {
      bg: 'primary.700',
      color: 'white',
      _hover: { bg: 'hover' },
      _disabled: { bg: 'primary.700', opacity: 0.5, pointerEvents: 'none' },
      _active: { bg: 'gray.200', color: 'gray.700' },
    },
  },
};

export default button;
