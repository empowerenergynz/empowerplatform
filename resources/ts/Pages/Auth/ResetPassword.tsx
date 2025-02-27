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
import useResetPasswordForm from 'src/Hooks/Forms/Auth/useResetPasswordForm';
import PasswordInputWrapper from 'src/Components/Forms/PasswordInputWrapper';

interface ResetPasswordProps {
  token: string;
  email: string;
}

const ResetPassword = ({ email, token }: ResetPasswordProps) => {
  const {
    formState: { data, setData, errors, processing },
    handlers: { submit },
  } = useResetPasswordForm(email, token);

  return (
    <AuthLayout>
      <Text fontSize="2xl" mt="6" mb="2" fontWeight="600">
        Set New Password
      </Text>
      <Text color="gray.700" fontSize="md">
        for {data.email}
      </Text>
      <VStack
        mt="8"
        as="form"
        noValidate
        onSubmit={submit}
        spacing="6"
        alignItems="start"
        data-testid="reset-password-form"
        mb="45px"
      >
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

        <Button type="submit" disabled={processing} variant="solidPrimary">
          Set Password
        </Button>
      </VStack>
    </AuthLayout>
  );
};

export default ResetPassword;
