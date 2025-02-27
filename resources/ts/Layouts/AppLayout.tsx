import React, { ReactNode, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  Flex,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Page } from '@inertiajs/inertia';
import { AppSharedProps } from 'src/Types/AppSharedProps';
import { usePage } from '@inertiajs/inertia-react';
import Footer from 'src/Layouts/Footer';
import SideBar, { mobileBreakpoint, sideBarWidth } from 'src/Layouts/SideBar';
import MobileHeader from 'src/Layouts/MobileHeader';

export default ({
  children,
  dataTestid,
}: {
  children: ReactNode;
  dataTestid?: string;
}) => {
  const {
    props: { flash },
  } = usePage<Page<AppSharedProps>>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    flash?.map((flashMessage) =>
      toast({
        title: flashMessage.title,
        description: flashMessage.content,
        status: flashMessage.status,
        isClosable: true,
        duration: flashMessage.status === 'error' ? null : 5000,
      })
    );
  }, [flash, toast]);

  return (
    <Flex
      data-testid={dataTestid ?? ''}
      minH="window-height"
      alignItems="stretch"
      backgroundColor="white.200"
      fontSize="sm"
    >
      <SideBar
        // permanent sidebar on Desktop
        onClose={() => onClose}
        display={{ base: 'none', [mobileBreakpoint]: 'flex' }}
      />
      <Drawer
        // temporary sidebar on mobile
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SideBar onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Flex
        as="main"
        direction="column"
        ml={{ base: 0, [mobileBreakpoint]: sideBarWidth }}
        flexGrow={1}
      >
        <MobileHeader onOpen={onOpen} />
        <Flex direction="column" p={6} flexGrow={1}>
          {children}
        </Flex>
        <Footer />
      </Flex>
    </Flex>
  );
};
