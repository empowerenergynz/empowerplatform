import React from 'react';
import { Box } from '@chakra-ui/react';
import { mobileBreakpoint } from 'src/Layouts/SideBar';

const Footer = () => {
  return (
    <Box
      as="footer"
      pt="68px"
      pb="19px"
      textAlign="center"
      backgroundColor="primary.700"
      color="white"
      fontSize="12px"
      display={{ base: 'none', [mobileBreakpoint]: 'block' }}
    >
      &copy; 2024 Empower Energy (NZ)
    </Box>
  );
};

export default Footer;
