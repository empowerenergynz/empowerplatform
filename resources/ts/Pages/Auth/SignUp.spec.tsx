import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from 'src/Pages/Auth/SignUp';
import AppLayout from 'src/Layouts/AppLayout';
import { UserFactory } from 'src/Types/User';
import useSignUpForm from 'src/Hooks/Forms/Auth/useSignUpForm';
import { ThemeProvider } from '@chakra-ui/react';

jest.mock('src/Hooks/Forms/Auth/useSignUpForm');
jest.mock('src/Layouts/AppLayout');
jest.mock('@inertiajs/inertia-react', () => ({
  ...jest.requireActual('@inertiajs/inertia-react'),
  usePage: jest.fn(() => ({
    props: {
      appName: 'Test App Name',
    },
  })),
}));

describe('The SignUp form', () => {
  const user = UserFactory.build();

  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  it('shows the app name', async () => {
    const mockUseSignUpForm = useSignUpForm as jest.Mock;
    mockUseSignUpForm.mockImplementation(() => {
      return {
        formState: {
          data: {},
          errors: {},
          processing: false,
          setData: jest.fn(),
        },
        handlers: { submit: jest.fn() },
      };
    });

    render(
      <ThemeProvider theme="default">
        <SignUp user={user} token={'foo'} />
      </ThemeProvider>
    );

    expect(
      screen.getByText('You’ve been invited to Test App Name')
    ).toBeVisible();
  });

  it('sets form state when an input value is changed', async () => {
    const setData = jest.fn();
    const mockUseSignUpForm = useSignUpForm as jest.Mock;
    mockUseSignUpForm.mockImplementation(() => {
      return {
        formState: {
          data: {},
          errors: {},
          processing: false,
          setData,
        },
        handlers: { submit: jest.fn() },
      };
    });

    render(
      <ThemeProvider theme="default">
        <SignUp user={user} token={'foo'} />
      </ThemeProvider>
    );

    await userEvent.type(screen.getByLabelText('Password'), 'Password');
    expect(setData).toHaveBeenCalledWith('password', 'Password');

    await userEvent.type(screen.getByLabelText('Phone number'), '+64033719454');
    expect(setData).toHaveBeenCalledWith('phone_number', '+6433719454');
  });

  it('renders error messages for any invalid fields', () => {
    const errors = {
      phone_number: 'phone number invalid',
      password: 'password invalid',
    };

    const mockUseSignUpForm = useSignUpForm as jest.Mock;
    mockUseSignUpForm.mockImplementation(() => {
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
        <SignUp user={user} token={'foo'} />
      </ThemeProvider>
    );

    Object.values(errors).forEach((message) => {
      expect(screen.getByText(message)).toBeVisible();
    });
  });

  it.skip('disables the submit button when the request is processing', () => {
    const mockUseSignUpForm = useSignUpForm as jest.Mock;
    mockUseSignUpForm.mockImplementation(() => {
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
        <SignUp user={user} token={'foo'} />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeDisabled();
  });

  it('calls the submit handler when the form is submitted', () => {
    const submit = jest.fn();

    const mockUseSignUpForm = useSignUpForm as jest.Mock;
    mockUseSignUpForm.mockImplementation(() => {
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
        <SignUp user={user} token={'foo'} />
      </ThemeProvider>
    );

    fireEvent.submit(screen.getByTestId('sign-up-form'));

    expect(submit).toHaveBeenCalled();
  });

  it('fills the form with user values', () => {
    const submit = jest.fn();

    const mockUseSignUpForm = useSignUpForm as jest.Mock;
    mockUseSignUpForm.mockImplementation(() => {
      return {
        formState: {
          data: {
            email: user.email,
          },
          errors: {},
          processing: false,
          setData: jest.fn(),
        },
        handlers: { submit },
      };
    });

    render(
      <ThemeProvider theme="default">
        <SignUp user={user} token={'foo'} />
      </ThemeProvider>
    );

    expect(screen.getByLabelText('Email')).toHaveValue(user.email);
  });
});
