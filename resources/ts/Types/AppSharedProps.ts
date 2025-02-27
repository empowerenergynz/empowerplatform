import { AuthUser } from 'src/Types/AuthUser';
import { AlertStatus } from '@chakra-ui/react';

export type FlashMessage = {
  content: string;
  title: string;
  status: AlertStatus;
};

export type AppSharedProps = {
  authUser: AuthUser;
  flash?: FlashMessage[];
  searchKey: string;
  searchIndex: string;
  appName: string;
};
