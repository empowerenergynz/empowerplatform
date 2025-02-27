import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const LeftIcon = (props: IconProps) => (
  <Icon
    width="10px"
    height="16px"
    viewBox="0 0 10 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.5 15L1.5 8L8.5 1"
      stroke={'inherit'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
