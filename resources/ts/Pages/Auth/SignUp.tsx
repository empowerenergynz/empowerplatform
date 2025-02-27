import React from 'react';
import {
  Button,
  Text,
  VStack,
  FormControl,
  Input,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';
import AuthLayout from 'src/Layouts/AuthLayout';
import { User } from 'src/Types/User';
import useSignUpForm from 'src/Hooks/Forms/Auth/useSignUpForm';
import PasswordInputWrapper from 'src/Components/Forms/PasswordInputWrapper';
import PhoneInput from 'src/Components/Forms/PhoneInput';
import { usePage } from '@inertiajs/inertia-react';
import { Page } from '@inertiajs/inertia';
import { AppSharedProps } from 'src/Types/AppSharedProps';

interface RegisterProps {
  user: User;
  token: string;
}

const SignUp = ({ user, token }: RegisterProps) => {
  const {
    props: { appName },
  } = usePage<Page<AppSharedProps>>();

  const {
    formState: { data, setData, errors, processing },
    handlers: { submit },
  } = useSignUpForm(user, token);

  return (
    <AuthLayout>
      <Text fontSize="2xl" mt="6" mb="2" fontWeight="600" w="260px">
        <span data-testid="welcome-form">
          Welcome {user.name}
          <br />
        </span>
        You’ve been invited to {appName}
      </Text>
      <Text color="gray.700" fontSize="md">
        Continue to Sign Up
      </Text>
      <VStack
        mt="8"
        as="form"
        noValidate
        onSubmit={submit}
        spacing="6"
        alignItems="start"
        data-testid="sign-up-form"
        mb="45px"
      >
        <FormControl isInvalid={'email' in errors}>
          <Input
            aria-label="Email"
            placeholder="Email"
            variant="outline"
            id="email"
            type="email"
            name="email"
            readOnly={true}
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={'phone_number' in errors}>
          <PhoneInput
            value={data.phone_number}
            onChange={(value) => setData('phone_number', value)}
          />
          <FormErrorMessage>{errors.phone_number}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={'password' in errors}>
          <PasswordInputWrapper>
            <Input
              aria-label="Password"
              placeholder="Password"
              variant="outline"
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
            />
          </PasswordInputWrapper>
          <FormErrorMessage>{errors.password}</FormErrorMessage>
          <FormHelperText textAlign="left">
            Use 12 or more characters.
          </FormHelperText>
        </FormControl>

        <FormControl isInvalid={'password_confirmation' in errors}>
          <PasswordInputWrapper>
            <Input
              aria-label="Password Confirmation"
              placeholder="Password Confirmation"
              variant="outline"
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
            />
          </PasswordInputWrapper>
          <FormErrorMessage>{errors.password_confirmation}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          disabled={processing}
          width="115px"
          colorScheme="blue"
        >
          Sign Up
        </Button>
      </VStack>
    </AuthLayout>
  );
};

export default SignUp;
