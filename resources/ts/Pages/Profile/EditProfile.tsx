import React, { FormEvent, ReactElement } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  HStack,
  VStack,
} from '@chakra-ui/react';
import AppLayout from 'src/Layouts/AppLayout';
import { Role, User } from 'src/Types/User';
import RolesPicker from 'src/Components/Users/Forms/RolesPicker';
import FormInputWithLabel from 'src/Components/Forms/FormInputWithLabel';
import { useForm } from '@inertiajs/inertia-react';

interface EditProfilePageProps {
  user: User;
  roles: Role[];
}

const EditProfile = ({ user, roles }: EditProfilePageProps) => {
  const form = useForm({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    phone_number: user.phone_number || '',
    email: user.email || '',
  });
  const { errors, setData, put, processing, data } = form;

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    put('/profile');
  };

  return (
    <Container
      as="form"
      noValidate={true}
      onSubmit={handleSubmit}
      data-testid="edit-profile-form"
      maxW="unset"
    >
      <Flex justifyContent="space-between">
        <HStack>
          <Box as="h1" ml={3} mb={0} textStyle="h1">
            Edit Profile
          </Box>
        </HStack>
        <Button type="submit" variant="solidPrimary" isLoading={processing}>
          Save
        </Button>
      </Flex>

      <Flex flexDirection={{ base: 'column', md: 'row' }}>
        <VStack backgroundColor="white.200" padding={6} flex={1}>
          <HStack width="100%" spacing={4} marginBottom={6}>
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
              isRequired
            />
          </HStack>
          <HStack width="100%" spacing={4} paddingBottom={6}>
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
          </HStack>
          <Divider borderBottomWidth="1px" borderColor="gray.300" />
          <HStack width="100%" spacing="4" paddingTop={6}>
            <RolesPicker roles={roles} selectedRoles={user.roles} readonly />
            <Box w="100%"></Box>
          </HStack>
        </VStack>
      </Flex>
    </Container>
  );
};

EditProfile.layout = (page: ReactElement) => <AppLayout children={page} />;

export default EditProfile;
