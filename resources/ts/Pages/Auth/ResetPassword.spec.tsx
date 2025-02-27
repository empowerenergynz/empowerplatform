import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import useResetPasswordForm from 'src/Hooks/Forms/Auth/useResetPasswordForm';
import userEvent from '@testing-library/user-event';
import AppLayout from 'src/Layouts/AppLayout';
import ResetPassword from 'src/Pages/Auth/ResetPassword';
import { ThemeProvider } from '@chakra-ui/react';

jest.mock('src/Hooks/Forms/Auth/useResetPasswordForm');
jest.mock('src/Layouts/AppLayout');

describe('The ResetPassword form', () => {
  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  it('sets form state when an input value is changed', async () => {
    const setData = jest.fn();
    const mockUseResetPasswordForm = useResetPasswordForm as jest.Mock;
    mockUseResetPasswordForm.mockImplementation(() => {
      return {
        formState: {
          data: {
            email: 'foo@bar.com',
          },
          errors: {},
          processing: false,
          setData,
        },
        handlers: { submit: jest.fn() },
      };
    });

    render(
      <ThemeProvider theme="default">
        <ResetPassword email="foo@bar.com" token="foo" />
      </ThemeProvider>
    );
    expect(screen.getByText('for foo@bar.com')).toBeVisible();

    await userEvent.type(screen.getByLabelText('Password'), 'my_password');
    await userEvent.type(
      screen.getByLabelText('Password Confirmation'),
      'my_password'
    );

    expect(setData).toHaveBeenCalledWith('password', 'my_password');
    expect(setData).toHaveBeenCalledWith(
      'password_confirmation',
      'my_password'
    );
  });

  it('renders error messages for any invalid fields', () => {
    const errors = {
      password: 'password invalid',
    };

    const mockUseResetPasswordForm = useResetPasswordForm as jest.Mock;
    mockUseResetPasswordForm.mockImplementation(() => {
      return {
        formState: {
          data: {},
          errors,
          processing: false,
          setData: jest.fn(),
        },
        handlers: { submit: jest.fn() },
      };
    });

    render(
      <ThemeProvider theme="default">
        <ResetPassword email="foo@bar.com" token="foo" />
      </ThemeProvider>
    );

    Object.values(errors).forEach((message) => {
      expect(screen.getByText(message)).toBeVisible();
    });
  });

  it.skip('disables the submit button when the request is processing', () => {
    const mockUseResetPasswordForm = useResetPasswordForm as jest.Mock;
    mockUseResetPasswordForm.mockImplementation(() => {
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
        <ResetPassword email="foo@bar.com" token="foo" />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: 'Set Password' })).toBeDisabled();
  });

  it('calls the submit handler when the form is submitted', () => {
    const submit = jest.fn();

    const mockUseResetPasswordForm = useResetPasswordForm as jest.Mock;
    mockUseResetPasswordForm.mockImplementation(() => {
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
        <ResetPassword email="foo@bar.com" token="foo" />
      </ThemeProvider>
    );

    fireEvent.submit(screen.getByTestId('reset-password-form'));

    expect(submit).toHaveBeenCalled();
  });
});
