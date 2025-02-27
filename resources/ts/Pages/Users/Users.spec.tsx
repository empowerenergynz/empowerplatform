import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Users from 'src/Pages/Users/Users';
import { RoleFactory, UserFactory } from 'src/Types/User';
import AppLayout from 'src/Layouts/AppLayout';
import userEvent from '@testing-library/user-event';
import useUsersQuery from 'src/Hooks/Queries/useUsersQuery';
import usePermissions from 'src/Hooks/usePermissions';
import { PaginatorFactory } from 'src/Types/Paginator';
import { Inertia } from '@inertiajs/inertia';
import { AgencyFactory } from 'src/Types/Agency';

jest.mock('src/Layouts/AppLayout');
jest.mock('src/Hooks/Queries/useUsersQuery');
jest.mock('src/Hooks/usePermissions');

jest.mock('@inertiajs/inertia', () => ({
  ...jest.requireActual('@inertiajs/inertia'),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Inertia: {
    visit: jest.fn(),
  },
}));

describe('The users list page', () => {
  afterEach(() => jest.clearAllMocks());

  const users = UserFactory.buildList(3);
  const usersPaginator = PaginatorFactory.build({
    data: users,
  });
  const agency = AgencyFactory.build({
    name: 'Foo Agency',
  });
  users[0].agency = agency;
  const roles = RoleFactory.buildList(3);
  roles.push(RoleFactory.build({ name: 'Ninja Developer' }));

  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  const mockUsePermissions = usePermissions as jest.Mock;
  mockUsePermissions.mockReturnValue([true, true]); // [canEditUsers, canCreateUsers]

  const setSearch = jest.fn();
  const filterRoles = jest.fn();
  const filterStatus = jest.fn();
  const status = 'Invited';
  const mockUseUsersQuery = useUsersQuery as jest.Mock;
  mockUseUsersQuery.mockImplementation(() => {
    return {
      setSearch,
      filterRoles,
      filterStatus,
      status,
    };
  });

  it('displays user details', async () => {
    render(<Users usersPaginator={usersPaginator} roles={roles} />);

    const user = users[0];
    expect(screen.getByText(user.name)).toBeVisible();
    expect(screen.getByText(user.email)).toBeVisible();
    expect(screen.getByText('Foo Agency')).toBeVisible();
  });

  it("calls setSearch when filter's input value is changed", async () => {
    render(<Users usersPaginator={usersPaginator} roles={roles} />);

    const search = 'Foo';
    await userEvent.type(screen.getByLabelText('Search users'), search);
    expect(setSearch).toHaveBeenCalledWith(search);
  });

  it("calls filterRoles when filter's dropdown value is changed", async () => {
    render(<Users usersPaginator={usersPaginator} roles={roles} />);

    await userEvent.click(await screen.findByRole('button', { name: 'Roles' }));

    await userEvent.click(await screen.findByText(roles[3].name));
    expect(filterRoles).toHaveBeenCalled();
  });

  it("calls filterStatus when filter's dropdown value is changed", async () => {
    render(<Users usersPaginator={usersPaginator} roles={roles} />);

    const comboBox = await screen.findByRole('combobox');
    await userEvent.selectOptions(comboBox, 'Invited');

    expect(filterStatus).toHaveBeenCalled();
  });

  it('shows the admin buttons when users have permission to create users', () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true, true]); // [canEditUsers, canCreateUsers]

    render(<Users usersPaginator={usersPaginator} roles={roles} />);

    expect(screen.getByText('Import Donors')).toBeVisible();
    expect(screen.getByText('Add User')).toBeVisible();
  });

  it("opens modal when the 'Import Donors' button is clicked", async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true, true]); // [canEditUsers, canCreateUsers]

    render(<Users usersPaginator={usersPaginator} roles={roles} />);

    const button = screen.queryByText('Import Donors');
    expect(button).not.toBeNull();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await userEvent.click(button!);

    // wait for modal to open
    await waitFor(() =>
      expect(screen.queryByTestId('modal-title')).toBeVisible()
    );
    expect(screen.getByTestId('import-donors-modal')).toBeVisible();
    // further testing of the modal is in its own spec...
  });

  it('does not display the admin buttons when users do not have permission to create users', () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true, false]); // [canEditUsers, canCreateUsers]

    render(<Users usersPaginator={usersPaginator} roles={roles} />);

    expect(screen.queryByText('Import Donors')).toBeNull();
    expect(screen.queryByText('Add User')).toBeNull();
  });

  it('allows viewing a user', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true, true]); // [canEditUsers, canCreateUsers]

    const user = users[0];
    render(<Users usersPaginator={usersPaginator} roles={roles} />);

    await userEvent.click(screen.getByText(user.name));
    expect(Inertia.visit).toHaveBeenCalledWith(`/users/${user.id}`);
  });

  it('allows viewing a user even without edit user permission', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([false, true]); // [canEditUsers, canCreateUsers]

    const user = users[0];
    render(<Users usersPaginator={usersPaginator} roles={roles} />);

    await userEvent.click(screen.getByText(user.name));
    expect(Inertia.visit).toHaveBeenCalledWith(`/users/${user.id}`);
  });
});
