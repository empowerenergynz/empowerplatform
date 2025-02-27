import React from 'react';
import { render, screen } from '@testing-library/react';
import usePermissions from 'src/Hooks/usePermissions';
import UserLayout from 'src/Layouts/UserLayout';
import { RoleFactory, UserFactory, UserRoles } from 'src/Types/User';

const user = UserFactory.build({
  roles: [RoleFactory.build({ name: UserRoles.DONOR })],
});

jest.mock('src/Hooks/usePermissions');
jest.mock('@inertiajs/inertia-react', () => ({
  ...jest.requireActual('@inertiajs/inertia-react'),
  usePage: jest.fn(() => ({
    props: {
      user,
      currentPage: 'details',
    },
  })),
}));

describe('The user layout screen', () => {
  afterAll(() => jest.clearAllMocks());

  it('renders show user with donations tab if donor and authorised', async () => {
    const usePermissionsMock = usePermissions as jest.Mock;
    usePermissionsMock.mockImplementation(() => [true, true]); // VIEW_PAST_DONATIONS, CREATE_PAST_DONATIONS

    render(<UserLayout children={null} />);

    expect(screen.queryAllByTestId('past-donations-link')).toHaveLength(1);
  });

  it('renders import button if authorised', async () => {
    const usePermissionsMock = usePermissions as jest.Mock;
    usePermissionsMock.mockImplementation(() => [true, true]); // VIEW_PAST_DONATIONS, CREATE_PAST_DONATIONS

    render(<UserLayout children={null} />);

    expect(
      screen.queryAllByTestId('import-past-donations-button')
    ).toHaveLength(1);
  });

  it('hides import button if not authorised', async () => {
    const usePermissionsMock = usePermissions as jest.Mock;
    usePermissionsMock.mockImplementation(() => [true, false]); // VIEW_PAST_DONATIONS, CREATE_PAST_DONATIONS

    render(<UserLayout children={null} />);

    expect(
      screen.queryAllByTestId('import-past-donations-button')
    ).toHaveLength(0);
  });

  it('renders show user without donations tab if not authorised', async () => {
    const usePermissionsMock = usePermissions as jest.Mock;
    usePermissionsMock.mockImplementation(() => [false, true]); // VIEW_PAST_DONATIONS, CREATE_PAST_DONATIONS

    render(<UserLayout children={null} />);

    expect(screen.queryAllByTestId('past-donations-link')).toHaveLength(0);
  });

  it('renders show user without donations tab if not donor but authorised', async () => {
    const usePermissionsMock = usePermissions as jest.Mock;
    usePermissionsMock.mockImplementation(() => [true, true]); // VIEW_PAST_DONATIONS, CREATE_PAST_DONATIONS

    user.roles = [];
    render(<UserLayout children={null} />);

    expect(screen.queryAllByTestId('past-donations-link')).toHaveLength(0);
  });

  it('renders show user for archived user', async () => {
    const usePermissionsMock = usePermissions as jest.Mock;
    usePermissionsMock.mockImplementation(() => [true, true]); // VIEW_PAST_DONATIONS, CREATE_PAST_DONATIONS

    user.deleted_at = new Date().toISOString();
    render(<UserLayout children={null} />);

    expect(screen.getByText(user.name + ' (Archived)')).toBeVisible();
  });
});
