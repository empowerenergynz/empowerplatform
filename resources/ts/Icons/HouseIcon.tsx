import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

// icon isn't vertically centered so shift it down with the viewBox

export const HouseIcon = (props: IconProps) => (
  <Icon viewBox="0 -1 24 23" {...props}>
    <path
      d="M12 0 2 9h3v8h14V9h3L12 0zM7 15V7.19l5-4.5 5 4.5V15H7zm7-4c0 1.1-.9 2-2 2s-2-.9-2-2 2-4 2-4 2 2.9 2 4z"
      fill="currentColor"
    />
  </Icon>
);
