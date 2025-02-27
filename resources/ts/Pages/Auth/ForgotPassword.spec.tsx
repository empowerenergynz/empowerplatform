import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import useForgotPasswordForm from 'src/Hooks/Forms/Auth/useForgotPasswordForm';
import userEvent from '@testing-library/user-event';
import ForgotPassword from 'src/Pages/Auth/ForgotPassword';
import { ThemeProvider } from '@chakra-ui/react';

jest.mock('src/Hooks/Forms/Auth/useForgotPasswordForm');

describe('The Forgot password form', () => {
  it('sets form state when an input value is changed', async () => {
    const setData = jest.fn();
    const mockUseForgotPasswordForm = useForgotPasswordForm as jest.Mock;
    mockUseForgotPasswordForm.mockImplementationOnce(() => {
      return {
        formState: { data: {}, errors: {}, processing: false, setData },
        handlers: { submit: jest.fn() },
      };
    });

    render(
      <ThemeProvider theme="default">
        <ForgotPassword />
      </ThemeProvider>
    );

    await userEvent.type(screen.getByLabelText('Email'), 'foo@bar.com');

    expect(setData).toHaveBeenCalledWith('email', 'foo@bar.com');
  });

  it('renders error messages for any invalid fields', () => {
    const errors = {
      email: 'email error',
    };

    const mockUseForgotPasswordForm = useForgotPasswordForm as jest.Mock;
    mockUseForgotPasswordForm.mockImplementationOnce(() => {
      return {
        formState: { data: {}, errors, processing: false, setData: jest.fn() },
        handlers: { submit: jest.fn() },
      };
    });

    render(
      <ThemeProvider theme="default">
        <ForgotPassword />
      </ThemeProvider>
    );

    Object.values(errors).forEach((message) => {
      expect(screen.getByText(message)).toBeVisible();
    });
  });

  it.skip('disables the submit button when the request is processing', () => {
    const mockUseForgotPasswordForm = useForgotPasswordForm as jest.Mock;
    mockUseForgotPasswordForm.mockImplementationOnce(() => {
      return {
        formState: {
          data: {},
          errors: {},
          processing: true,
          setData: jest.fn(),
        },
        handlers: { submit: jest.fn() },
      };
    });

    render(
      <ThemeProvider theme="default">
        <ForgotPassword />
      </ThemeProvider>
    );

    expect(
      screen.getByRole('button', { name: 'Send Reset Password Email' })
    ).toBeDisabled();
  });

  it('calls the submit handler when the form is submitted', () => {
    const submit = jest.fn();

    const mockUseForgotPasswordForm = useForgotPasswordForm as jest.Mock;
    mockUseForgotPasswordForm.mockImplementationOnce(() => {
      return {
        formState: {
          data: {},
          errors: {},
          processing: false,
          setData: jest.fn(),
        },
        handlers: { submit },
      };
    });

    render(
      <ThemeProvider theme="default">
        <ForgotPassword />
      </ThemeProvider>
    );

    fireEvent.submit(screen.getByTestId('forgot-password-form'));

    expect(submit).toHaveBeenCalled();
  });
});
