/* eslint-disable @typescript-eslint/naming-convention */

import { extendTheme } from '@chakra-ui/react';
import { inputAnatomy } from '@chakra-ui/anatomy';
import type { PartsStyleFunction } from '@chakra-ui/theme-tools';
import { getColor, mode } from '@chakra-ui/theme-tools';
import button from './Config/button';
import descriptionList from 'src/Theme/Config/descriptionList';

const inputInvertedVariant: PartsStyleFunction<typeof inputAnatomy> = (
  props
) => {
  // this is only used for the algolia search box when focussed
  const { colorScheme: c, theme, focusBorderColor, errorBorderColor } = props;
  const { focusBorderColor: fc, errorBorderColor: ec } = {
    focusBorderColor: focusBorderColor || mode('blue.500', 'blue.300')(props),
    errorBorderColor: errorBorderColor || mode('red.500', 'red.300')(props),
  };

  return {
    field: {
      color: mode('white', `${c}.900`)(props),
      border: '1px solid',
      borderColor: mode(`${c}.900`, `${c}.50`)(props),
      bg: mode(`${c}.900`, `${c}.50`)(props),
      _hover: {
        borderColor: mode('gray.300', 'whiteAlpha.400')(props),
      },
      _readOnly: {
        boxShadow: 'none !important',
        userSelect: 'all',
      },
      _disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
      _invalid: {
        borderColor: getColor(theme, ec),
        boxShadow: `0 0 0 1px ${getColor(theme, ec)}`,
      },
      _focus: {
        zIndex: 1,
        borderColor: getColor(theme, fc),
        boxShadow: `0 0 0 1px ${getColor(theme, fc)}`,
      },
      _placeholder: {
        color: mode('white', `${c}.500`)(props),
      },
    },
    addon: {
      border: '1px solid',
      borderColor: mode('whiteAlpha.50', 'inherit')(props),
      bg: mode('whiteAlpha.300', 'gray.100')(props),
      color: mode('white', `${c}.500`)(props),
    },
  };
};

const components = {
  DescriptionList: descriptionList,
  Heading: {
    defaultProps: {
      size: 'md',
    },
  },
  Input: {
    variants: {
      inverted: inputInvertedVariant,
    },
  },
  Text: {
    baseStyle: {
      fontSize: 'sm',
    },
  },
  FormLabel: {
    baseStyle: {
      color: 'gray.700',
    },
  },
  Checkbox: {
    baseStyle: {
      control: {
        backgroundColor: 'white',
      },
    },
  },
  Button: button,
};

const theme = extendTheme({
  components,
  fonts: {
    body: 'Inter, helvetica, sans-serif',
    heading: 'Inter, helvetica, sans-serif',
    mono: 'monospace',
  },
  colors: {
    blue: {
      400: '#2E90FF',
      500: '#3182CE',
      600: '#003CBF',
      800: '#0019bf',
    },
    white: {
      200: '#FDFDFD',
    },
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    },
    orange: {
      50: '#FFFAF0',
      300: '#F9C49B',
      500: '#DD6B20',
    },
    black: {
      300: '#001833',
    },
    green: {
      50: '#F0FFF4',
      200: '#A2F1D8',
      300: '#AEE9D1',
      400: '#92E6B5',
      500: '#38A169',
      700: '#134C3F',
    },
    purple: {
      500: '#805AD5',
    },
    primary: {
      // "Meteorite"
      50: '#c0aeec',
      100: '#b39ee8',
      200: '#997de0',
      300: '#7f5cd8',
      500: '#532cb7',
      600: '#442496',
      700: '#351c75',
      800: '#201148',
      900: '#0c061a',
    },
    secondary: {
      // supernova
      500: '#ffd529',
      600: '#ffcd00',
    },
    teal: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C5',
      400: '#38B2AC',
      500: '#319795',
      600: '#2C7A7B',
      700: '#285E61',
      800: '#234E52',
      900: '#1D4044',
    },
    hover: '#820084',
    body: {
      // "Wildsand"
      50: '#f5f5f5',
      100: '#e7e7e7',
      200: '#cbcbcb',
      300: '#afafaf',
      700: '#4d4d4d',
    },
  },
  textStyles: {
    smallBoldText: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
      lineHeight: '1.5rem',
      letterSpacing: '0',
    },
    pageTitle: {
      fontSize: '2.625rem',
      fontWeight: 'bold',
      lineHeight: '2.1rem',
    },
    h1: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      lineHeight: '2.6875rem',
      letterSpacing: '-0.72px',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      lineHeight: '2.2375rem',
      textTransform: 'capitalize',
    },
    h3: {
      fontSize: '1.625rem',
      fontWeight: 'bold',
      lineHeight: '2.055rem',
    },
  },
  styles: {
    global: {
      body: {
        color: 'body.700',
      },
      // fix the horizontal scroll bar when the page overflows vertically
      'body > div': {
        overflowX: 'auto',
      },
      '*::placeholder': {
        color: 'gray.500',
      },
    },
  },
});

export default theme;

/* eslint-enable @typescript-eslint/naming-convention */
