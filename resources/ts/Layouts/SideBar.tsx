import React from 'react';
import {
  Avatar,
  Box,
  BoxProps,
  CloseButton,
  Divider,
  Flex,
  List,
  Text,
} from '@chakra-ui/react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { LogoIcon } from 'src/Icons/LogoIcon';
import { MenuItem } from 'src/Components/Menu/MenuItem';
import { DonationsIcon } from 'src/Icons/DonationsIcon';
import { HistoryIcon } from 'src/Icons/HistoryIcon';
import { AgenciesIcon } from 'src/Icons/AgenciesIcon';
import { UsersIcon } from 'src/Icons/UsersIcon';
import { LogoutIcon } from 'src/Icons/LogoutIcon';
import { Inertia, Page } from '@inertiajs/inertia';
import usePermissions from 'src/Hooks/usePermissions';
import { Permissions } from 'src/Types/Permission';
import { AppSharedProps } from 'src/Types/AppSharedProps';
import { CreditsIcon } from 'src/Icons/CreditsIcon';

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export const sideBarWidth = '280px';
export const mobileBreakpoint = 'md';

const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
  const {
    props: { authUser },
  } = usePage<Page<AppSharedProps>>();

  const [
    canViewDonations,
    canViewOwnPastDonations,
    canViewUsers,
    canViewAgencies,
    canViewAllCredits,
    canViewAgencyCredits,
    canCreateCredits,
    canViewOwnAgencyBalance,
  ] = usePermissions([
    Permissions.VIEW_DONATIONS,
    Permissions.VIEW_OWN_PAST_DONATIONS,
    Permissions.VIEW_USERS,
    Permissions.VIEW_AGENCIES,
    Permissions.VIEW_ALL_CREDITS,
    Permissions.VIEW_AGENCY_CREDITS,
    Permissions.CREATE_CREDITS,
    Permissions.VIEW_OWN_AGENCY_BALANCE,
  ]);

  return (
    <Flex
      direction="column"
      as="aside"
      w={{ base: 'full', [mobileBreakpoint]: sideBarWidth }}
      transition="3s ease"
      pos="fixed"
      h="full"
      px="6"
      py="8"
      borderRightWidth="1px"
      borderRightColor="body.100"
      backgroundColor="body.50"
      onClick={onClose}
      data-testid="sidebar"
      zIndex="1000"
      {...rest}
    >
      <Flex mb="36px" justifyContent="space-between">
        <InertiaLink href="/">
          <LogoIcon />
        </InertiaLink>
        <CloseButton
          data-testid="close-sidebar"
          display={{ base: 'flex', [mobileBreakpoint]: 'none' }}
          onClick={onClose}
        />
      </Flex>

      <List spacing={2} flexGrow={1}>
        {canViewDonations && (
          <MenuItem label="Donations" to="/donations" icon={DonationsIcon} />
        )}
        {canViewOwnPastDonations && (
          <MenuItem label="History" to="/history" icon={HistoryIcon} />
        )}
        {canCreateCredits && (
          <MenuItem
            label="New Client Allocation"
            to="/credits/create"
            icon={CreditsIcon}
          />
        )}
        {canViewOwnAgencyBalance && (
          <MenuItem label="Balance" to="/balance" icon={CreditsIcon} />
        )}
        {canViewAgencies && (
          <MenuItem label="Agencies" to="/agencies" icon={AgenciesIcon} />
        )}
        {(canViewAllCredits || canViewAgencyCredits) && (
          <MenuItem
            label="Bill Credits"
            nochildren={true}
            to="/credits"
            icon={CreditsIcon}
          />
        )}
        {canViewUsers && (
          <MenuItem label="User Management" to="/users" icon={UsersIcon} />
        )}
      </List>

      <Box>
        <Divider mb={4} borderColor="body.200" />
        <Flex alignItems="center" justifyContent="space-between" mt="5">
          <Flex as={InertiaLink} href="/profile">
            <Avatar
              name={authUser.name}
              bg="secondary.600"
              color="primary.700"
              fontWeight="bold"
            />
            <Box overflow="hidden" marginX="2" maxW="145px">
              <Text fontWeight="700" data-testid="user-name">
                {authUser.name}
              </Text>
              <Text color="gray.700">{authUser.email}</Text>
            </Box>
          </Flex>
          <LogoutIcon
            boxSize="24px"
            data-testid="logout"
            cursor="pointer"
            onClick={() => Inertia.post('/logout')}
            aria-label="Logout"
            color="primary.700"
          />
        </Flex>
      </Box>
    </Flex>
  );
};

export default Sidebar;
