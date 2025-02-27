import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const DonationsIcon = (props: IconProps) => (
  <Icon viewBox="0 0 18 18" {...props} fill="none">
    <path
      d="M7.125 11.167c0 .728.563 1.313 1.253 1.313h1.41c.6 0 1.087-.51 1.087-1.148 0-.682-.3-.93-.742-1.087l-2.258-.788c-.442-.157-.742-.397-.742-1.087 0-.63.487-1.148 1.087-1.148h1.41c.69 0 1.252.585 1.252 1.313M9 6.48v6.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 9.854c0 4.14-3.36 7.5-7.5 7.5-4.14 0-7.5-3.36-7.5-7.5 0-4.14 3.36-7.5 7.5-7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.75 3.104v3h3M16.5 2.354l-3.75 3.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
