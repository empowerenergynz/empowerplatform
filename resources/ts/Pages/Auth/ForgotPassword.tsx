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
import useForgotPasswordForm from 'src/Hooks/Forms/Auth/useForgotPasswordForm';

const ForgotPassword = () => {
  const {
    formState: { data, setData, errors, processing },
    handlers: { submit },
  } = useForgotPasswordForm();

  return (
    <AuthLayout>
      <Text fontSize="2xl" mt="6" mb="2" fontWeight="600">
        Reset Password
      </Text>
      <VStack
        mt="8"
        as="form"
        noValidate
        onSubmit={submit}
        spacing="6"
        alignItems="start"
        data-testid="forgot-password-form"
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

        <Button type="submit" disabled={processing} variant="solidPrimary">
          Send Reset Password Email
        </Button>

        <Text color="gray.700">
          Don't want to reset?&nbsp;
          <Link as={InertiaLink} href="/login" color="primary.800">
            Login
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default ForgotPassword;
