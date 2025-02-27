import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import useLoginForm from 'src/Hooks/Forms/Auth/useLoginForm';
import userEvent from '@testing-library/user-event';
import Login from 'src/Pages/Auth/Login';
import { ThemeProvider } from '@chakra-ui/react';

jest.mock('src/Hooks/Forms/Auth/useLoginForm');

describe('The Login form', () => {
  it('sets form state when an input value is changed', async () => {
    const setData = jest.fn();
    const mockUseLoginForm = useLoginForm as jest.Mock;
    mockUseLoginForm.mockImplementation(() => {
      return {
        formState: { data: {}, errors: {}, processing: false, setData },
        handlers: { submit: jest.fn() },
      };
    });

    render(
      <ThemeProvider theme="default">
        <Login />
      </ThemeProvider>
    );

    await userEvent.type(screen.getByLabelText('Email'), 'foo@bar.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');

    expect(setData).toHaveBeenCalledWith('email', 'foo@bar.com');
    expect(setData).toHaveBeenCalledWith('password', 'password');
  });

  it('renders error messages for any invalid fields', () => {
    const errors = {
      email: 'email error',
      password: 'password error',
    };

    const mockUseLoginForm = useLoginForm as jest.Mock;
    mockUseLoginForm.mockImplementation(() => {
      return {
        formState: { data: {}, errors, processing: false, setData: jest.fn() },
        handlers: { submit: jest.fn() },
      };
    });

    render(
      <ThemeProvider theme="default">
        <Login />
      </ThemeProvider>
    );

    Object.values(errors).forEach((message) => {
      expect(screen.getByText(message)).toBeVisible();
    });
  });

  it.skip('disables the submit button when the request is processing', () => {
    const mockUseLoginForm = useLoginForm as jest.Mock;
    mockUseLoginForm.mockImplementation(() => {
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
        <Login />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: 'Log in' })).toBeDisabled();
  });

  it('calls the submit handler when the form is submitted', () => {
    const submit = jest.fn();

    const mockUseLoginForm = useLoginForm as jest.Mock;
    mockUseLoginForm.mockImplementation(() => {
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
        <Login />
      </ThemeProvider>
    );

    fireEvent.submit(screen.getByTestId('login-form'));

    expect(submit).toHaveBeenCalled();
  });
});
