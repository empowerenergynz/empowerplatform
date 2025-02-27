import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const CreditsIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 25" {...props} fill="none">
    <path
      d="M9.5 14.105c0 .97.75 1.75 1.67 1.75h1.88c.8 0 1.45-.68 1.45-1.53 0-.91-.4-1.24-.99-1.45l-3.01-1.05c-.59-.21-.99-.53-.99-1.45 0-.84.65-1.53 1.45-1.53h1.88c.92 0 1.67.78 1.67 1.75M12 7.854v9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 12.354c0 5.52-4.48 10-10 10s-10-4.48-10-10 4.48-10 10-10M22 6.354v-4h-4M17 7.354l5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
