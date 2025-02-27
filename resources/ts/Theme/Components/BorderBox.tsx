import React, { ReactNode } from 'react';
import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { mobileBreakpoint } from 'src/Layouts/SideBar';

interface BorderBoxProps extends BoxProps {
  children: ReactNode;
  label: string;
  noBorder?: boolean;
  action?: ReactNode;
}

const BorderBox = ({
  children,
  label,
  action,
  noBorder,
  ...rest
}: BorderBoxProps) => {
  return (
    <Box
      borderRadius="md"
      // on mobile the BorderBox has a large heading and no outer border
      border={
        noBorder ? undefined : { base: 0, [mobileBreakpoint]: '1px solid' }
      }
      // need to provide for both so the color doesn't get overwritten by the above media query
      borderColor={{ base: 'gray.200', [mobileBreakpoint]: 'gray.200' }}
      p={{ base: 0, [mobileBreakpoint]: 6 }}
      display="flex"
      flexDirection="column"
      {...rest}
    >
      <Box
        as="h2"
        pb={3}
        mb={8}
        borderBottom="1px solid"
        borderColor="gray.200"
        textStyle={{ base: 'h1', [mobileBreakpoint]: 'smallBoldText' }}
        color="gray.600"
      >
        <Flex justifyContent="space-between" alignItems="center" h="40px">
          <div>{label}</div>
          <div>{action}</div>
        </Flex>
      </Box>
      {children}
    </Box>
  );
};

export default BorderBox;
