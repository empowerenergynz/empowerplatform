import React, { ReactElement, ReactNode, useMemo, useState } from 'react';
import { Box, Button, Flex, HStack, List, Spacer } from '@chakra-ui/react';
import BackButton from 'src/Components/Common/BackButton';
import { usePage } from '@inertiajs/inertia-react';
import { Page } from '@inertiajs/inertia';
import NavItem from 'src/Components/Common/NavItem';
import usePermissions from 'src/Hooks/usePermissions';
import { Permissions } from 'src/Types/Permission';
import { User, UserRoles } from 'src/Types/User';
import AppLayout from 'src/Layouts/AppLayout';
import ImportCsvModal from 'src/Pages/Users/ImportCsvModal';

export enum NavItemKeys {
  DETAILS = 'details',
  HISTORY = 'history',
}

export type UserLayoutProps = {
  user: User;
  currentTab: string;
};

const UserLayout = ({ children }: { children: ReactNode }) => {
  const [canViewPastDonations, canCreatePastDonations] = usePermissions([
    Permissions.VIEW_PAST_DONATIONS,
    Permissions.CREATE_PAST_DONATIONS,
  ]);

  const {
    props: { user, currentTab },
  } = usePage<Page<UserLayoutProps>>();

  const isDonor = useMemo<boolean>(
    () => !!user.roles.find((r) => r.name == UserRoles.DONOR),
    [user.roles]
  );

  const [importPastDonations, setImportPastDonations] =
    useState<boolean>(false);

  return (
    <Flex flexDirection="column" alignItems="stretch" w="full" flexGrow="1">
      <HStack mb={6}>
        <BackButton href="/users" label="Back to users list" />
        <Box as="h1" mb={0} textStyle="h1">
          {user.name}
          {user.deleted_at ? ' (Archived)' : ''}
        </Box>
        <Spacer />
        {canCreatePastDonations && (
          <Button
            data-testid="import-past-donations-button"
            variant="solidPrimary"
            onClick={(e) => {
              e.preventDefault();
              setImportPastDonations(true);
            }}
          >
            Import Past Donations
          </Button>
        )}
      </HStack>
      {isDonor && canViewPastDonations && (
        <Box as="nav" mb={6}>
          <HStack as={List} borderBottom="2px solid" borderColor="gray.200">
            <NavItem
              href={`/users/${user.id}`}
              label="Details"
              isCurrent={NavItemKeys.DETAILS === currentTab}
            />
            <NavItem
              href={`/users/${user.id}/history`}
              label="History"
              isCurrent={NavItemKeys.HISTORY === currentTab}
              data-testid="past-donations-link"
            />
          </HStack>
        </Box>
      )}
      <Box display="flex" flexDirection="column" flexGrow="1">
        {children}
      </Box>
      {importPastDonations && (
        <ImportCsvModal
          onClose={() => setImportPastDonations(false)}
          title="Import Past Donations"
          endpoint="/donations/import-history"
        />
      )}
    </Flex>
  );
};

UserLayout.layout = (page: ReactElement) => (
  <AppLayout>
    <UserLayout children={page} />
  </AppLayout>
);

export default UserLayout;
