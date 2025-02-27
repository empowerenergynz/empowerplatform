import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import RolesPicker from 'src/Components/Users/Forms/RolesPicker';
import userEvent from '@testing-library/user-event';

describe('The RolePicker component', () => {
  const exclusiveRole = {
    id: '1',
    name: 'Customer',
    color: '#AEE9D1',
    description: 'lorem ipsum',
  };
  const adminRole = {
    id: '2',
    name: 'Admin',
    color: '#AEE9D1',
    description: 'lorem ipsum',
  };

  it('renders the RolePicker component', async () => {
    const roles = [exclusiveRole, adminRole];
    const selectedRole = [exclusiveRole];

    const onChange = jest.fn();

    render(
      <RolesPicker
        roles={roles}
        selectedRoles={selectedRole}
        readonly={true}
        onChange={onChange}
        exclusiveRole={exclusiveRole}
      />
    );
    const roleButton = screen.getByRole('button', { name: 'Customer' });
    await userEvent.click(roleButton);

    await waitFor(() => {
      expect(screen.getByText('Admin').parentElement).toHaveAttribute(
        'data-disabled'
      );
    });
    const customerCheckbox = screen.getByTestId(
      `checkboxRolePick-${exclusiveRole.id}`
    );
    await userEvent.click(customerCheckbox);
    await waitFor(() => {
      expect(screen.getByText('Admin').parentElement).toHaveAttribute(
        'data-disabled',
        ''
      );
    });
  });
});
