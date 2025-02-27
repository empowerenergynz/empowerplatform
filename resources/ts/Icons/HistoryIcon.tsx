import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const HistoryIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      d="M10.854 2.353a.501.501 0 0 1 .146.354v2l-.006 1.25c.006 0 .001.622 0 .753a.5.5 0 0 1-.848.356l-2-2.003a.5.5 0 0 1 0-.708l2-2.002a.5.5 0 0 1 .708 0z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
    <path
      d="M12 9.62v4l3 3M5.636 7.254A9 9 0 1 0 12 4.62m-.016 0h-2.02"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
