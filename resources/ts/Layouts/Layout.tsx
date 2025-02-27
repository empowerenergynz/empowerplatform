import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { Page } from '@inertiajs/inertia';
import { AppSharedProps } from 'src/Types/AppSharedProps';
import { useToast } from '@chakra-ui/react';

const Layout = ({ children }: { children: JSX.Element }) => {
  const {
    props: { flash },
  } = usePage<Page<AppSharedProps>>();
  const toast = useToast();

  useEffect(() => {
    flash?.map((flashMessage) =>
      toast({
        title: flashMessage.title,
        description: flashMessage.content,
        status: flashMessage.status,
        isClosable: true,
      })
    );
  }, [flash, toast]);

  return <>{children}</>;
};

export default Layout;
