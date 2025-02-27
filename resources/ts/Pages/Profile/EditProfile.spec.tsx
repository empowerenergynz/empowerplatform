import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppLayout from 'src/Layouts/AppLayout';
import { UserFactory } from 'src/Types/User';
import EditProfile from 'src/Pages/Profile/EditProfile';
import { Inertia } from '@inertiajs/inertia';

jest.mock('src/Layouts/AppLayout');
jest.mock('@inertiajs/inertia');

describe('The EditProfile form', () => {
  const roles = [
    {
      id: '1',
      name: 'Admin',
      color: '#AEE9D1',
      description: 'lorem ipsum',
    },
    {
      id: '2',
      name: 'User',
      color: '#AEE9D1',
      description: 'lorem ipsum',
    },
  ];

  const user = UserFactory.build();

  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  it('posts modified data to the expected endpoint', async () => {
    render(<EditProfile user={user} roles={roles} />);
    await userEvent.type(screen.getByLabelText('First name*'), 'Foo');
    await userEvent.type(screen.getByLabelText('Last name'), 'Bar');
    await userEvent.type(screen.getByLabelText('Email address'), '2');
    await userEvent.clear(screen.getByLabelText('Phone number'));
    await userEvent.type(screen.getByLabelText('Phone number'), '+6433719454');

    fireEvent.submit(screen.getByTestId('edit-profile-form'));
    expect(Inertia.put).toHaveBeenCalledWith(
      '/profile',
      {
        first_name: user.first_name + 'Foo',
        last_name: user.last_name + 'Bar',
        phone_number: '+6433719454',
        email: user.email + '2',
      },
      expect.anything()
    );
  });

  it('renders error messages for any invalid fields', () => {
    const errors = {
      email: 'email invalid',
      phone_number: 'phone number invalid',
    };

    const mockInertiaPut = Inertia.put as jest.Mock;
    mockInertiaPut.mockImplementationOnce((url, data, { onError }) => {
      onError(errors);
    });

    render(<EditProfile user={user} roles={roles} />);
    fireEvent.submit(screen.getByTestId('edit-profile-form'));

    expect(screen.getByText(errors.email)).toBeVisible();
    expect(screen.getByText(errors.phone_number)).toBeVisible();
  });

  it('shows spinner and disables Save button when submitting', () => {
    const mockInertiaPut = Inertia.put as jest.Mock;
    mockInertiaPut.mockImplementationOnce((url, data, { onStart }) => {
      onStart();
    });

    render(<EditProfile user={user} roles={roles} />);

    fireEvent.submit(screen.getByTestId('edit-profile-form'));

    const button = document.querySelector('button[type="submit"]');
    expect(button).toHaveAttribute('data-loading');
    expect(button).toBeDisabled();
  });
});
