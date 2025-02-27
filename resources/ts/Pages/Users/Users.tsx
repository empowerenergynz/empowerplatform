import React, { ReactElement, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Input,
  Select,
  Skeleton,
  Spacer,
  Text,
} from '@chakra-ui/react';
import AppLayout from 'src/Layouts/AppLayout';
import { Role, User } from 'src/Types/User';
import useUsersQuery from 'src/Hooks/Queries/useUsersQuery';
import { Permissions } from 'src/Types/Permission';
import usePermissions from 'src/Hooks/usePermissions';
import MultiSelect from 'src/Components/Forms/MultiSelect';
import { ChevronDownIcon } from '@chakra-ui/icons';
import LinkSortColumnHeader from 'src/Components/List/LinkSortColumnHeader';
import DataTableHeaderRow from 'src/Components/Common/DataTableHeaderRow';
import Paginator from 'src/Components/List/Paginator';
import { Paginator as PaginatorType } from 'src/Types/Paginator';
import { format, parseISO } from 'date-fns';
import useResendInvite from 'src/Hooks/useResendInvite';
import { Inertia } from '@inertiajs/inertia';
import UserRoleTags from 'src/Pages/Users/UserRoleTags';
import InertiaButtonLink from 'src/Theme/Components/InertiaButtonLink';
import ImportCsvModal from 'src/Pages/Users/ImportCsvModal';

interface UsersPageProps {
  usersPaginator: PaginatorType<User>;
  roles: Role[];
  filter?: {
    search: string;
    role: string[];
    status: string;
  };
}

const Users = ({ usersPaginator, roles, filter }: UsersPageProps) => {
  const { search, setSearch, filterRoles, filterStatus, processing, status } =
    useUsersQuery({ filter });
  const resendInvite = useResendInvite();
  const [canEditUsers, canCreateUsers] = usePermissions([
    Permissions.EDIT_USERS,
    Permissions.CREATE_USERS,
  ]);

  const rolesOptions = roles.map((role): [string, string] => [
    role.id,
    role.name,
  ]);
  const statusOptions = ['Invited', 'Active', 'Archived'];

  const onRolesChange = (value: string[]) => {
    filterRoles(value);
  };

  const [importDonors, setImportDonors] = useState<boolean>(false);

  return (
    <>
      <Box
        as="h1"
        data-testid="page-title"
        color="primary.700"
        textStyle="h2"
        mb="10px"
      >
        Users
      </Box>
      <Flex mt={2} mb={6} justifyContent="space-between">
        <Flex>
          <Input
            aria-label="Search users"
            width="320px"
            mx={1}
            autoFocus
            type="search"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <MultiSelect
            width="130px"
            name="Roles"
            items={rolesOptions}
            onChange={onRolesChange}
            selectedOptions={filter?.role}
          />
          <Select
            width="130px"
            id="user-status-filter"
            size="md"
            fontSize="md"
            placeholder="Status"
            objectPosition="right"
            icon={<ChevronDownIcon />}
            onChange={(e) => filterStatus(e.target.value)}
            defaultValue={status}
            color="gray.700"
            _placeholder={{ color: 'gray.700' }}
            fontWeight={600}
          >
            {statusOptions.map((value) => (
              <option key={value} value={value.toLowerCase()}>
                {value}
              </option>
            ))}
          </Select>
        </Flex>
        {canCreateUsers && (
          <Flex alignSelf="flex-end">
            <Button
              variant="solidPrimary"
              onClick={(e) => {
                e.preventDefault();
                setImportDonors(true);
              }}
            >
              Import Donors
            </Button>
            <InertiaButtonLink
              ml="12px"
              href="/users/create"
              variant="solidPrimary"
            >
              Add User
            </InertiaButtonLink>
          </Flex>
        )}
      </Flex>
      <DataTableHeaderRow templateColumns="repeat(5, 1fr)">
        <LinkSortColumnHeader
          label="Name"
          column="name"
          dataKey="usersPaginator"
        />
        <Box my="auto" px="3">
          Role
        </Box>
        <LinkSortColumnHeader
          label="Email"
          column="email"
          dataKey="usersPaginator"
        />
        <Box my="auto" px="3">
          Organisation
        </Box>
        <Box my="auto" px="3">
          Activity
        </Box>
      </DataTableHeaderRow>
      <Skeleton
        isLoaded={!processing}
        display="Flex"
        flexDirection="column"
        flexGrow="1"
      >
        {usersPaginator.data.length > 0 ? (
          <Box data-testid="users-list">
            {usersPaginator.data.map((user) => (
              <Grid
                data-testid="user-row"
                cursor="pointer"
                autoColumns="auto"
                key={user.id}
                templateColumns="repeat(5, 1fr)"
                borderRadius="md"
                borderWidth="1px"
                onClick={(event) => {
                  event.preventDefault();
                  Inertia.visit(`/users/${user.id}`);
                }}
                py={5}
                px={3}
                mt={2}
              >
                <Flex>
                  <Avatar
                    name={user.name}
                    mr={4}
                    my="auto"
                    size="sm"
                    backgroundColor={
                      user.deleted_at ? 'gray.100' : 'secondary.600'
                    }
                    color="white"
                  />
                  <HStack>
                    <Text color={user.deleted_at ? 'gray.500' : 'blue.500'}>
                      {user.name}
                    </Text>
                  </HStack>
                </Flex>
                <HStack spacing={4}>
                  <UserRoleTags user={user} />
                </HStack>
                <Box my="auto" color={user.deleted_at ? 'gray.500' : ''}>
                  {user.email}
                </Box>
                <Box my="auto" color={user.deleted_at ? 'gray.500' : ''}>
                  {user.agency?.name}
                </Box>
                {user.last_login_at ? (
                  <Text my="auto" display="inline-block" color="gray.500">
                    {`Last Login ${format(
                      parseISO(user.last_login_at),
                      "dd/MM/y 'at' p"
                    )}`}
                  </Text>
                ) : (
                  user.invited_at && (
                    <Box my="auto">
                      <Text display="inline-block" color="gray.500">
                        {`Invite Sent ${user.invited_at}`}
                      </Text>
                      {canEditUsers && (
                        <Button
                          onClick={(event) => {
                            event.stopPropagation();
                            resendInvite(user);
                          }}
                          variant="link"
                          height="fit-content"
                          color={user.deleted_at ? 'gray.500' : 'blue.500'}
                          fontWeight="normal"
                          textDecoration="underline"
                          fontSize="sm"
                          ml={1}
                          disabled={!!user.deleted_at}
                        >
                          Resend
                        </Button>
                      )}
                    </Box>
                  )
                )}
              </Grid>
            ))}
          </Box>
        ) : (
          <Box
            my="auto"
            borderRadius="md"
            borderWidth="1px"
            textAlign="center"
            p={4}
            mt={2}
          >
            No Users
          </Box>
        )}
        <Spacer />
        <Paginator paginator={usersPaginator} />
      </Skeleton>
      {importDonors && (
        <ImportCsvModal
          onClose={() => setImportDonors(false)}
          title="Import Donors"
          endpoint="/users/import-donors"
        />
      )}
    </>
  );
};

Users.layout = (page: ReactElement) => <AppLayout children={page} />;

export default Users;
