import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import usePermissions from 'src/Hooks/usePermissions';
import CreateUser from 'src/Pages/Users/CreateUser';
import AppLayout from 'src/Layouts/AppLayout';
import { Inertia } from '@inertiajs/inertia';
import { ArchivedUserFactory, UserFactory, UserRoles } from 'src/Types/User';
import { AgencyFactory } from 'src/Types/Agency';

jest.mock('src/Hooks/usePermissions');
jest.mock('src/Layouts/AppLayout');
jest.mock('@inertiajs/inertia');

describe('The CreateUser form', () => {
  const roles = [
    {
      id: '1',
      name: UserRoles.ADMIN,
      color: '#AEE9D1',
      description: 'lorem ipsum',
    },
    {
      id: '2',
      name: UserRoles.SUPER_ADMIN,
      color: '#AEE9D1',
      description: 'lorem ipsum',
    },
    {
      id: '3',
      name: UserRoles.AGENCY_USER,
      color: '#AEE9D1',
      description: 'lorem ipsum',
    },
  ];

  const user = UserFactory.build({
    first_name: 'Test',
    last_name: 'User',
    email: 'test@user.com',
    roles: [roles[0]],
  });

  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  const agencies = AgencyFactory.buildList(3);

  it('renders create user', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true]); // [canDeleteUsers]

    render(<CreateUser roles={roles} agencies={agencies} />);
    expect(screen.getByLabelText('First name*')).toHaveValue('');
    expect(screen.getByLabelText('Last name')).toHaveValue('');
    expect(screen.getByLabelText('Email address*')).toHaveValue('');
  });

  it('renders edit user', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true]); // [canDeleteUsers]

    render(<CreateUser user={user} roles={roles} agencies={agencies} />);
    expect(screen.getByLabelText('First name*')).toHaveValue(user.first_name);
    expect(screen.getByLabelText('Last name')).toHaveValue(user.last_name);
    expect(screen.getByLabelText('Email address*')).toHaveValue(user.email);
  });

  it('shows and submits Agency field for Agency roles', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true]); // [canDeleteUsers]

    render(<CreateUser user={user} roles={roles} agencies={agencies} />);

    // Agency picker not visible by default
    expect(screen.queryByLabelText('Agency*')).toBeNull();

    fireEvent.click(screen.getByTestId('select-roles'));
    // Deselect the User's initial role
    fireEvent.click(screen.getByText(user.roles[0].name, { selector: 'p' }));
    // Select an Agency role
    fireEvent.click(screen.getByText(UserRoles.AGENCY_USER));

    // Agency picker visible and working
    expect(screen.getByLabelText('Agency*')).toBeVisible();
    fireEvent.change(screen.getByLabelText('Agency*'), {
      target: { value: agencies[0].id },
    });

    // submit the form
    fireEvent.submit(screen.getByTestId('create-user-form'));

    expect(Inertia.put).toHaveBeenCalledWith(
      `/users/${user.id}`,
      {
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        email: user.email,
        roles: ['3'],
        agency_id: agencies[0].id.toString(),
      },
      expect.anything()
    );
  });

  it('posts the data to the expected endpoint on submit new user', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true]); // [canDeleteUsers]
    render(<CreateUser roles={roles} agencies={agencies} />);

    await userEvent.type(
      screen.getByLabelText('First name*'),
      user.first_name || ''
    );
    await userEvent.type(
      screen.getByLabelText('Last name'),
      user.last_name || ''
    );
    await userEvent.type(screen.getByLabelText('Phone number'), '021123456');
    await userEvent.type(
      screen.getByLabelText('Email address*'),
      user.email || ''
    );

    fireEvent.submit(screen.getByTestId('create-user-form'));
    expect(Inertia.post).toHaveBeenCalledWith(
      '/users',
      {
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: '+6421123456',
        email: user.email,
        roles: [],
        agency_id: '',
      },
      expect.anything()
    );
  });

  it('puts the data to the expected endpoint on submit existing user', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true]); // [canDeleteUsers]
    render(<CreateUser user={user} roles={roles} agencies={agencies} />);
    const editEmail = 'Newemail@email.com';

    userEvent.clear(screen.getByLabelText('Email address*'));
    await userEvent.type(screen.getByLabelText('Email address*'), editEmail);

    fireEvent.submit(screen.getByTestId('create-user-form'));
    expect(Inertia.put).toHaveBeenCalledWith(
      `/users/${user.id}`,
      {
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        email: editEmail,
        roles: user.roles.map((r) => r.id),
        agency_id: '',
      },
      expect.anything()
    );
  });

  it('renders error messages for any invalid fields', () => {
    const errors = {
      email: 'email invalid',
      phone_number: 'phone number invalid',
    };

    const mockInertiaPost = Inertia.post as jest.Mock;
    mockInertiaPost.mockImplementationOnce((url, data, { onError }) => {
      onError(errors);
    });

    render(<CreateUser roles={roles} agencies={agencies} />);
    fireEvent.submit(screen.getByTestId('create-user-form'));

    expect(screen.getByText(errors.phone_number)).toBeVisible();
    expect(screen.getByText(errors.email)).toBeVisible();
  });

  it('displays a loading spinner while the form is submitting', () => {
    const mockInertiaPost = Inertia.post as jest.Mock;
    mockInertiaPost.mockImplementationOnce((url, data, { onStart }) => {
      onStart();
    });
    render(<CreateUser roles={roles} agencies={agencies} />);
    fireEvent.submit(screen.getByTestId('create-user-form'));
    const button = document.querySelector('button[type="submit"]');
    expect(button).toHaveAttribute('data-loading');
    expect(button).toBeDisabled();
  });

  it('allows to archive an active user', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true]); // [canDeleteUsers]
    const user = UserFactory.build();
    render(<CreateUser user={user} roles={roles} agencies={agencies} />);

    const button = await screen.findByRole('button', { name: 'Active' });
    await userEvent.click(button);

    const archiveButton = await screen.findByRole('menuitem', {
      name: 'Archive',
    });
    await userEvent.click(archiveButton);

    const archiveModalButton = await screen.findByRole('button', {
      name: 'Archive',
    });
    await userEvent.click(archiveModalButton);

    expect(Inertia.delete).toHaveBeenCalledWith(`/users/${user?.id}`);
  });

  it('allows to restore an archived user', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([true]); // [canDeleteUsers]
    const user = ArchivedUserFactory.build();
    render(<CreateUser user={user} roles={roles} agencies={agencies} />);

    const button = await screen.findByRole('button', { name: 'Archived' });
    await userEvent.click(button);

    const restoreButton = await screen.findByRole('menuitem', {
      name: 'Active',
    });
    await userEvent.click(restoreButton);

    expect(Inertia.patch).toHaveBeenCalledWith(`/users/${user?.id}/restore`);
  });

  it('allows logged in user to not archive an active user if the user does not have the permission', async () => {
    const mockUsePermissions = usePermissions as jest.Mock;
    mockUsePermissions.mockReturnValue([false]); // [canDeleteUsers]
    const user = UserFactory.build();
    render(<CreateUser user={user} roles={roles} agencies={agencies} />);

    await waitFor(() => {
      const activeButton = screen.queryByRole('menuitem', {
        name: 'Active',
      });
      expect(activeButton).toBeNull();
    });
  });
});
