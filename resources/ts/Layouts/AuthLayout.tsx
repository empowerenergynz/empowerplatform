import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { LogoIcon } from 'src/Icons/LogoIcon';

export default ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <Flex
      alignItems="center"
      backgroundImage="linear-gradient(235deg, #c0aeec 5%, #201148 95%);"
    >
      <Box
        bgColor="white"
        borderRadius="8px"
        p={{ base: '3', md: '10' }}
        margin={{ base: '0px auto', md: 'auto auto auto 145px' }}
      >
        <LogoIcon />
        <Box w={{ base: '295px', md: '395px' }}>{children}</Box>
      </Box>
    </Flex>
  );
};
