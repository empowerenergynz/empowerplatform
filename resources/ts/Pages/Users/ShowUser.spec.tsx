import usePermissions from 'src/Hooks/usePermissions';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { UserFactory } from 'src/Types/User';
import ShowUser from 'src/Pages/Users/ShowUser';
import { AgencyFactory } from 'src/Types/Agency';

jest.mock('src/Hooks/usePermissions');

describe('The show user screen', () => {
  const roles = [
    {
      id: '1',
      name: 'Admin',
      color: '#AEE9D1',
      description: 'lorem ipsum',
    },
  ];

  const agency = AgencyFactory.build({
    name: 'Foo Agency',
  });
  const user = UserFactory.build({
    first_name: 'Test',
    last_name: 'User',
    email: 'test@user.com',
    reference: 'JN 13899',
    agency,
    roles,
  });

  it('renders show user', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true]); // [canEditUser]

    render(<ShowUser user={user} currentTab="details" />);
    expect(screen.getByText(user.email)).toBeVisible();
    expect(screen.getByText('JN 13899')).toBeVisible();
    expect(screen.getByText('Test')).toBeVisible();
    expect(screen.getByText('User')).toBeVisible();
    expect(screen.getByText('Foo Agency')).toBeVisible();
  });

  it('renders show user that can update information', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true]); // [canEditUser]

    render(<ShowUser user={user} currentTab="details" />);
    const editUserButton = screen.getByText('Edit');
    expect(editUserButton).toBeVisible();
  });
});
