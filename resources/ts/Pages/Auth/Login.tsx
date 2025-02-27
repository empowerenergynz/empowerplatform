import React from 'react';
import {
  Button,
  Link,
  Text,
  VStack,
  FormControl,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';
import AuthLayout from 'src/Layouts/AuthLayout';
import { InertiaLink } from '@inertiajs/inertia-react';
import useLoginForm from 'src/Hooks/Forms/Auth/useLoginForm';
import PasswordInputWrapper from 'src/Components/Forms/PasswordInputWrapper';

const Login = () => {
  const {
    formState: { data, setData, errors, processing },
    handlers: { submit },
  } = useLoginForm();

  return (
    <AuthLayout>
      <Text fontSize="2xl" mt="6" mb="2" fontWeight="600">
        Log In
      </Text>
      <VStack
        mt="8"
        as="form"
        noValidate
        onSubmit={submit}
        spacing="6"
        alignItems="start"
        data-testid="login-form"
      >
        <FormControl isInvalid={'email' in errors}>
          <Input
            aria-label="Email"
            placeholder="Email"
            variant="outline"
            id="email"
            type="email"
            name="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={'password' in errors}>
          <PasswordInputWrapper>
            <Input
              pr="4.5rem"
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
        </FormControl>

        <Button
          type="submit"
          disabled={processing}
          width="115px"
          variant="solidPrimary"
        >
          Log in
        </Button>

        <Link as={InertiaLink} href="/forgot-password" color="gray.700">
          Forgot password?
        </Link>
      </VStack>
    </AuthLayout>
  );
};

export default Login;
