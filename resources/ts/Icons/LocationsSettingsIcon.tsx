import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const LocationsSettingsIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      opacity="0.4"
      d="M8 2C4 2 2 4 2 8V21C2 21.55 2.45 22 3 22H16C20 22 22 20 22 16V8C22 4 20 2 16 2H8Z"
      fill="currentColor"
    />
    <path
      d="M7 8.75C6.59 8.75 6.25 9.09 6.25 9.5C6.25 9.91 6.59 10.25 7 10.25H17C17.41 10.25 17.75 9.91 17.75 9.5C17.75 9.09 17.41 8.75 17 8.75H7Z"
      fill="currentColor"
    />
    <path
      d="M7 13.75C6.59 13.75 6.25 14.09 6.25 14.5C6.25 14.91 6.59 15.25 7 15.25H14C14.41 15.25 14.75 14.91 14.75 14.5C14.75 14.09 14.41 13.75 14 13.75H7Z"
      fill="currentColor"
    />
  </Icon>
);
