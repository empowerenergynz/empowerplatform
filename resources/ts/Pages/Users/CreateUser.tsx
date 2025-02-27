import React, { FormEvent, ReactElement, useMemo } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  VStack,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import AppLayout from 'src/Layouts/AppLayout';
import { Role, User } from 'src/Types/User';
import RolesPicker from 'src/Components/Users/Forms/RolesPicker';
import InertiaButtonLink from 'src/Theme/Components/InertiaButtonLink';
import BackButton from 'src/Components/Common/BackButton';
import BorderBox from 'src/Theme/Components/BorderBox';
import { useForm } from '@inertiajs/inertia-react';
import usePermissions from 'src/Hooks/usePermissions';
import { Permissions } from 'src/Types/Permission';
import { ChevronDownIcon } from '@chakra-ui/icons';
import ArchiveButton from 'src/Pages/Users/ArchiveButton';
import FormInputWithLabel from 'src/Components/Forms/FormInputWithLabel';
import { Inertia } from '@inertiajs/inertia';
import { Agency } from 'src/Types/Agency';

interface CreateUserPageProps {
  roles: Role[];
  disabledRoles?: Role[];
  exclusiveRole?: Role;
  user?: User;
  agencies: Agency[];
}

const CreateUser = ({
  roles,
  disabledRoles,
  exclusiveRole,
  user,
  agencies,
}: CreateUserPageProps) => {
  const [canDeleteUsers] = usePermissions([Permissions.DELETE_USERS]);

  const form = useForm({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    phone_number: user?.phone_number ?? '',
    email: user?.email ?? '',
    roles: user?.roles || [],
    agency_id: user?.agency_id || '',
  });

  const { errors, setData, post, put, processing, data, transform } = form;

  const onChangeRoles = (values: Role[]) => {
    setData('roles', values);
  };

  const roleIsAgency = useMemo(() => {
    return form.data.roles.some((r) =>
      r.name.toLocaleLowerCase().includes('agency')
    );
  }, [form.data.roles]);

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    transform((data) => ({
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      roles: (data.roles as Role[]).map((role: Role) => role.id) as any,
    }));
    if (user) {
      put(`/users/${user.id}`);
    } else {
      post('/users');
    }
  };

  const restoreUser = () => Inertia.patch(`/users/${user?.id}/restore`);

  const backLink = user ? `/users/${user.id}` : '/users';

  return (
    <VStack alignItems="stretch" spacing={6} w="full">
      <Flex justifyContent="space-between">
        <HStack>
          <BackButton
            href={backLink}
            label={`Go to ${user ? 'user' : 'users'} page`}
          />
          <Box as="h1" mb={0} textStyle="h1">
            {user?.name || 'Add User'}
          </Box>
        </HStack>

        {user && canDeleteUsers && (
          <Menu>
            <MenuButton
              ml="2px"
              as={Button}
              rightIcon={<ChevronDownIcon />}
              size="sm"
              colorScheme="purple"
            >
              {user.deleted_at ? 'Archived' : 'Active'}
            </MenuButton>
            <MenuList>
              {user.deleted_at ? (
                <MenuItem onClick={restoreUser}>Active</MenuItem>
              ) : (
                <ArchiveButton user={user} />
              )}
            </MenuList>
          </Menu>
        )}
      </Flex>
      <BorderBox label="USER DETAILS">
        <Container
          as="form"
          noValidate={true}
          onSubmit={handleSubmit}
          data-testid="create-user-form"
          p={0}
        >
          <VStack alignItems="stretch" spacing={4}>
            <FormInputWithLabel
              label="First name"
              name="first_name"
              data={data}
              setData={setData}
              errors={errors}
              isRequired
            />

            <FormInputWithLabel
              label="Last name"
              name="last_name"
              data={data}
              setData={setData}
              errors={errors}
            />

            <FormInputWithLabel
              label="Phone number"
              name="phone_number"
              type="phone"
              data={data}
              setData={setData}
              errors={errors}
            />

            <FormInputWithLabel
              label="Email address"
              name="email"
              data={data}
              setData={setData}
              errors={errors}
              isRequired
            />

            <RolesPicker
              roles={roles}
              selectedRoles={data.roles as Role[]}
              onChange={onChangeRoles}
              errors={errors.roles}
              exclusiveRole={exclusiveRole}
              disabledRoles={disabledRoles}
              multiple={true}
            />

            {roleIsAgency && (
              <FormInputWithLabel
                label="Agency"
                name="agency_id"
                data={data}
                setData={setData}
                errors={errors}
                isRequired
                type="select"
                options={agencies}
              />
            )}

            <ButtonGroup alignSelf="end" spacing={3} mt={4} py={4}>
              <InertiaButtonLink href={backLink} colorScheme="gray">
                Cancel
              </InertiaButtonLink>
              <Button
                type="submit"
                variant="solidPrimary"
                isLoading={processing}
              >
                Save
              </Button>
            </ButtonGroup>
          </VStack>
        </Container>
      </BorderBox>
    </VStack>
  );
};

CreateUser.layout = (page: ReactElement) => <AppLayout children={page} />;

export default CreateUser;
