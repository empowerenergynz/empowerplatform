import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

export const LogoIcon = () => (
  <Flex alignItems="center">
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="9" fill="#FFCD00" />
      <path
        d="M22.732 8h8.398l-3.32 9.805h6.483L15 42l6.484-17.237H15L22.732 8z"
        fill="#351C75"
      />
    </svg>
    <Flex
      flexDirection="column"
      ml={2}
      alignItems="flexStart"
      fontWeight="bold"
      fontSize="18px"
      lineHeight="1"
      height="48px"
      justifyContent="space-evenly"
    >
      <Box>EMPOWER</Box>
      <Box>ENERGY</Box>
    </Flex>
  </Flex>
);
