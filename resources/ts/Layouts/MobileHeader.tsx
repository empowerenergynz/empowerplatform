import React from 'react';
import { Flex, IconButton } from '@chakra-ui/react';
import { mobileBreakpoint } from 'src/Layouts/SideBar';
import { InertiaLink } from '@inertiajs/inertia-react';
import { LogoIcon } from 'src/Icons/LogoIcon';
import { HamburgerIcon } from '@chakra-ui/icons';

interface MobileHeaderProps {
  onOpen: () => void;
}

const MobileHeader = ({ onOpen }: MobileHeaderProps) => {
  return (
    <Flex
      display={{ base: 'flex', [mobileBreakpoint]: 'none' }}
      height="48px" // match logo height
      marginTop="12px" // gap below is in the page
      paddingX="12px"
      gap="10px"
      alignItems="center"
    >
      <IconButton
        onClick={onOpen}
        aria-label="open menu"
        variant="ghost"
        icon={<HamburgerIcon fontSize="32px" />}
      />

      <InertiaLink href="/">
        <LogoIcon />
      </InertiaLink>
    </Flex>
  );
};

export default MobileHeader;
