import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import AppLayout from 'src/Layouts/AppLayout';
import { DonationFactory } from 'src/Types/Donation';
import Donations from 'src/Pages/Donations/Donations';
import { PaginatorFactory } from 'src/Types/Paginator';
import { UserFactory } from 'src/Types/User';
import userEvent from '@testing-library/user-event';
import { Permissions } from 'src/Types/Permission';

jest.mock('src/Layouts/AppLayout');
jest.mock('src/Components/Forms/AddressGpsAutocomplete');

let permissions: Permissions[] = [];

jest.mock('@inertiajs/inertia-react', () => ({
  ...jest.requireActual('@inertiajs/inertia-react'),
  usePage: jest.fn(() => ({
    props: {
      authUser: {
        name: 'Test User',
        first_name: 'Test',
        last_name: 'User',
        permissions,
      },
    },
  })),
}));

describe('The donations list page', () => {
  const donations = DonationFactory.buildList(3);
  donations.forEach((donation) => {
    donation.user = UserFactory.build();
    donation.user_id = donation.user.id;
  });
  const donationsPaginator = PaginatorFactory.build({
    data: donations,
  });

  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  it("shows the user's first name", () => {
    render(<Donations donationsPaginator={donationsPaginator} />);

    expect(screen.getByText('Welcome Test!')).toBeVisible();
  });

  it("shows the donors' names instead of ICP if can view users", () => {
    permissions = [Permissions.VIEW_USERS];

    render(<Donations donationsPaginator={donationsPaginator} />);

    expect(screen.getByTestId('sort-donor')).toBeVisible();
    expect(screen.getByText(donations[0].user?.name || '')).toBeVisible();
    expect(screen.queryByText(donations[0].icp)).toBeNull();
  });

  it("shows the ICP instead of donors' names if can't view users", () => {
    permissions = [];

    render(<Donations donationsPaginator={donationsPaginator} />);

    expect(screen.queryByTestId('sort-donor')).toBeNull();
    expect(screen.queryByText(donations[0].user?.name || '')).toBeNull();
    expect(screen.getByText(donations[0].icp || '')).toBeVisible();
  });

  it('shows the donation active status', () => {
    const paginator2 = { ...donationsPaginator };
    paginator2.data = [donations[0]];
    donations[0].is_active = true;

    render(<Donations donationsPaginator={paginator2} />);

    expect(screen.getByText('ACTIVE')).toBeVisible();
    expect(screen.queryByText('PAUSED')).toBeNull();
  });

  it('shows the donation paused status', () => {
    const paginator2 = { ...donationsPaginator };
    paginator2.data = [donations[0]];
    donations[0].is_active = false;

    render(<Donations donationsPaginator={paginator2} />);

    expect(screen.queryByText('ACTIVE')).toBeNull();
    expect(screen.getByText('PAUSED')).toBeVisible();
  });

  it('shows the donation account number and retailer', () => {
    render(<Donations donationsPaginator={donationsPaginator} />);

    expect(screen.getByText(donations[0].account_number || '')).toBeVisible();
    expect(screen.getByText(donations[0].retailer)).toBeVisible();
  });

  it('shows donations dollar and percent value', () => {
    const paginator2 = { ...donationsPaginator };
    paginator2.data = [donations[0], donations[1]];
    donations[0].is_dollar = true;
    donations[0].amount = '34.56';
    donations[1].is_dollar = false;
    donations[1].amount = '12';

    render(<Donations donationsPaginator={paginator2} />);

    expect(screen.getByText('$34.56')).toBeVisible();
    expect(screen.getByText('12%')).toBeVisible();
  });

  it("shows the 'Add Donation' button when users have permission to create donations", () => {
    permissions = [Permissions.CREATE_DONATIONS];

    render(<Donations donationsPaginator={donationsPaginator} />);

    expect(screen.getByText('Add Donation')).toBeVisible();
  });

  it("does not display the 'Add Donation' button when users do not have permission to create donations", () => {
    permissions = [];

    render(<Donations donationsPaginator={donationsPaginator} />);

    expect(screen.queryByText('Add Donation')).toBeNull();
  });

  it("shows the 'Record Donation' button and opens modal when users have permission to create donations", async () => {
    permissions = [Permissions.CREATE_PAST_DONATIONS];

    render(<Donations donationsPaginator={donationsPaginator} />);

    const buttons = screen.queryAllByText('Record Donation');
    expect(buttons).toHaveLength(3);

    // click the button for the 2nd donation in the list
    await userEvent.click(buttons[1]);

    // wait for modal to open
    await waitFor(() =>
      expect(screen.queryByTestId('modal-title')).toBeVisible()
    );
    expect(await screen.getByTestId('record-donation-modal')).toBeVisible();

    // check the correct donation was opened in the modal
    expect(screen.getByLabelText('ICP*')).toHaveValue(donations[1].icp);

    // further testing of the modal is in its own spec...
  });

  it("does not display the 'Record Donation' button when users do not have permission to create donations", () => {
    permissions = [];

    render(<Donations donationsPaginator={donationsPaginator} />);

    expect(screen.queryByText('Record Donation')).toBeNull();
  });

  it("shows the 'Export Donations' button when users have permission to export donations", async () => {
    permissions = [Permissions.EXPORT_DONATIONS];

    render(<Donations donationsPaginator={donationsPaginator} />);

    const button = screen.queryAllByText('Export Donations');
    expect(button).toHaveLength(1);
  });

  it("does not display the 'Export Donations' button when users do not have permission to export donations", () => {
    permissions = [];

    render(<Donations donationsPaginator={donationsPaginator} />);

    expect(screen.queryByText('Export Donations')).toBeNull();
  });
});
