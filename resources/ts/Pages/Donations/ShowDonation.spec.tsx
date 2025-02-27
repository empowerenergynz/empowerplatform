import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AppLayout from 'src/Layouts/AppLayout';
import { DonationFactory } from 'src/Types/Donation';
import ShowDonation from 'src/Pages/Donations/ShowDonation';
import usePermissions from 'src/Hooks/usePermissions';
import AddressGpsAutocomplete from 'src/Components/Forms/AddressGpsAutocomplete';
import { UserFactory } from 'src/Types/User';

jest.mock('src/Layouts/AppLayout');
jest.mock('src/Hooks/usePermissions');
jest.mock('src/Components/Forms/AddressGpsAutocomplete');

describe('The ShowDonation screen', () => {
  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  const mockAddressGpsAutocomplete = AddressGpsAutocomplete as jest.Mock;
  mockAddressGpsAutocomplete.mockImplementation(({ address, setData }) => (
    <input
      id="address"
      value={address}
      onChange={(e) => setData(e.target.value)}
    />
  ));

  const donation = DonationFactory.build();
  donation.user = UserFactory.build();
  donation.user_id = donation.user.id;

  const mockUsePermissions = usePermissions as jest.Mock;

  it('does not show edit button when user can not edit donations', async () => {
    mockUsePermissions.mockReturnValue([false, false]); // [canEditDonations, canViewUsers]

    render(<ShowDonation donation={donation} />);

    await waitFor(() => {
      const editLink = screen.queryByRole('link', {
        name: 'Edit',
      });
      expect(editLink).toBeNull();
    });
  });

  it('shows edit button when user can edit donations', async () => {
    mockUsePermissions.mockReturnValue([true, false]); // [canEditDonations, canViewUsers]

    render(<ShowDonation donation={donation} />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit');
      expect(editButton).toBeVisible();
    });
  });

  it("displays donation's attributes", async () => {
    mockUsePermissions.mockReturnValue([false, false]); // [canEditDonations, canViewUsers]

    render(<ShowDonation donation={donation} />);

    expect(screen.getAllByText(donation.icp)).toHaveLength(2);
    expect(screen.getByText(donation.address)).toBeVisible();
    expect(screen.getByText(donation.gps_coordinates)).toBeVisible();
    expect(screen.getByText(donation.retailer)).toBeVisible();
    expect(screen.getByText(donation.account_number)).toBeVisible();
  });

  it("shows the donor's name and donation ID if can view users", () => {
    mockUsePermissions.mockReturnValue([false, true]); // [canEditDonations, canViewUsers]

    render(<ShowDonation donation={donation} />);

    expect(screen.getByText('Donor')).toBeVisible();
    expect(screen.getByText(donation.user?.name || '')).toBeVisible();
    expect(screen.getByTestId('donation-id')).toHaveTextContent(
      donation.id.toString()
    );
  });

  it("doesn't show the donor's name or donation ID if can't view users", () => {
    mockUsePermissions.mockReturnValue([false, false]); // [canEditDonations, canViewUsers]

    render(<ShowDonation donation={donation} />);

    expect(screen.queryByText('Donor')).toBeNull();
    expect(screen.queryByText(donation.user?.name || '')).toBeNull();
    expect(screen.queryByTestId('donation-id')).toBeNull();
  });

  it("displays donation's active status", async () => {
    mockUsePermissions.mockReturnValue([false, false]); // [canEditDonations, canViewUsers]
    donation.is_active = true;

    render(<ShowDonation donation={donation} />);

    expect(screen.getByText('ACTIVE')).toBeVisible();
    expect(screen.queryByText('PAUSED')).toBeNull();
  });

  it("displays donation's paused status", async () => {
    mockUsePermissions.mockReturnValue([false, false]); // [canEditDonations, canViewUsers]
    donation.is_active = false;

    render(<ShowDonation donation={donation} />);

    expect(screen.queryByText('ACTIVE')).toBeNull();
    expect(screen.getByText('PAUSED')).toBeVisible();
  });

  it("displays donation's dollar value", async () => {
    mockUsePermissions.mockReturnValue([false, false]); // [canEditDonations, canViewUsers]
    donation.is_dollar = true;
    donation.amount = '12.34';

    render(<ShowDonation donation={donation} />);

    expect(screen.getByText('$12.34')).toBeVisible();
    expect(screen.queryByText('Buy-Back Rate')).toBeNull();
  });

  it("displays donation's percent value and buy-back rate", async () => {
    mockUsePermissions.mockReturnValue([false, false]); // [canEditDonations, canViewUsers]
    donation.is_dollar = false;
    donation.amount = '56';
    donation.buyback_rate = '0.42';

    render(<ShowDonation donation={donation} />);

    expect(screen.getByText('56%')).toBeVisible();
    expect(screen.getByText('$0.42')).toBeVisible();
  });
});
