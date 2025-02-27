import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import AppLayout from 'src/Layouts/AppLayout';
import { DonationFactory } from 'src/Types/Donation';
import AddressGpsAutocomplete from 'src/Components/Forms/AddressGpsAutocomplete';
import CreateDonation, {
  OTHER_RETAILER,
} from 'src/Pages/Donations/CreateDonation';
import userEvent from '@testing-library/user-event';
import { Inertia } from '@inertiajs/inertia';
import { UserFactory } from 'src/Types/User';
import usePermissions from 'src/Hooks/usePermissions';

jest.mock('src/Layouts/AppLayout');
jest.mock('src/Components/Forms/AddressGpsAutocomplete');
jest.mock('@inertiajs/inertia');
jest.mock('src/Hooks/usePermissions');

jest.mock('@inertiajs/inertia-react', () => ({
  ...jest.requireActual('@inertiajs/inertia-react'),
  usePage: jest.fn(() => ({
    props: {
      authUser: {
        id: 123,
      },
    },
  })),
}));

describe('The CreateDonation form', () => {
  const retailers = ['Meridian'];

  const donation = DonationFactory.build();
  const donors = UserFactory.buildList(2);
  donation.retailer = retailers[0];
  donation.user = donors[0];
  donation.user_id = donation.user.id;

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

  const mockUsePermissions = usePermissions as jest.Mock;

  it('renders create donation without a donation or user search', async () => {
    mockUsePermissions.mockReturnValue([false]); // [canViewUsers]

    render(<CreateDonation retailers={retailers} />);

    expect(screen.queryByLabelText('Donor*')).toBeNull();
    expect(screen.getByLabelText('ICP*')).toHaveValue('');
    expect(screen.getByTestId('retailer-select')).toHaveValue('');
    expect(screen.queryByTestId('retailer')).toBeNull();
    expect(screen.getByLabelText('Account Number*')).toHaveValue('');
    expect(screen.getByLabelText('Donation Address')).toHaveValue('');
    expect(screen.getByLabelText('Donation GPS')).toHaveValue('');
    expect(screen.getByTestId('donation-type')).toHaveValue('true'); // dollar default
    expect(screen.getByLabelText('Donation Amount*')).toHaveValue(null);
    expect(screen.getByLabelText('Status')).toHaveValue('true'); // enabled default
  });

  it("renders create donation without donor name if can't view users, and with dollar amount and disabled", async () => {
    mockUsePermissions.mockReturnValue([false]); // [canViewUsers]
    donation.is_dollar = true;
    donation.amount = '12.34';
    donation.is_active = false;

    render(<CreateDonation donation={donation} retailers={retailers} />);

    expect(screen.queryByLabelText('Donor*')).toBeNull();
    expect(screen.getByLabelText('ICP*')).toHaveValue(donation.icp);
    expect(screen.getByLabelText('Donation Address')).toHaveValue(
      donation.address
    );
    expect(screen.getByLabelText('Donation GPS')).toHaveValue(
      donation.gps_coordinates
    );
    expect(screen.getByLabelText('Account Number*')).toHaveValue(
      donation.account_number
    );
    expect(screen.getByTestId('donation-type')).toHaveValue('true'); // dollar
    expect(screen.getByLabelText('Donation Amount*')).toHaveValue(12.34);
    expect(screen.getByLabelText('Status')).toHaveValue('false'); // disabled
  });

  it('renders create donation with a donor name if can view users, and with percent amount and enabled', async () => {
    mockUsePermissions.mockReturnValue([true]); // [canViewUsers]
    donation.is_dollar = false;
    donation.amount = '56';
    donation.buyback_rate = '0.42';
    donation.is_active = true;

    render(
      <CreateDonation
        donation={donation}
        donors={donors}
        retailers={retailers}
      />
    );

    expect(screen.getByLabelText('Donor*')).toHaveAttribute(
      'placeholder',
      donors[0].name
    );
    expect(screen.getByLabelText('ICP*')).toHaveValue(donation.icp);
    expect(screen.getByLabelText('Donation Address')).toHaveValue(
      donation.address
    );
    expect(screen.getByLabelText('Donation GPS')).toHaveValue(
      donation.gps_coordinates
    );
    expect(screen.getByLabelText('Account Number*')).toHaveValue(
      donation.account_number
    );
    expect(screen.getByTestId('donation-type')).toHaveValue('false'); // percent
    expect(screen.getByLabelText('Donation Amount*')).toHaveValue(56);
    expect(screen.getByLabelText('Buy-Back Rate*')).toHaveValue(0.42);
    expect(screen.getByLabelText('Status')).toHaveValue('true'); // enabled
  });

  it('renders retailer select box, shows warning and sets inactive if not in list', async () => {
    mockUsePermissions.mockReturnValue([false]); // [canViewUsers]

    render(<CreateDonation retailers={retailers} />);

    // by default the donation select box should have value '' with 'Please select' visible
    // and status should be disabled (but ACTIVE) and 'other' text box should not be visible
    expect(screen.getByTestId('retailer-select')).toHaveValue('');
    expect(screen.getByText('Please select')).toBeVisible();
    expect(screen.queryByTestId('retailer')).toBeNull();
    expect(screen.queryByTestId('retailer-not-listed')).toBeNull();
    expect(screen.getByLabelText('Status')).toBeDisabled();
    expect(screen.getByLabelText('Status')).toHaveValue('true');

    // selecting "Meridian" should enable Status
    await userEvent.selectOptions(
      screen.getByTestId('retailer-select'),
      retailers[0]
    );
    expect(screen.queryByTestId('retailer')).toBeNull();
    expect(screen.queryByTestId('retailer-not-listed')).toBeNull();
    expect(screen.getByLabelText('Status')).toBeEnabled();
    expect(screen.getByLabelText('Status')).toHaveValue('true');

    // selecting "Other" should show "other" input element
    await userEvent.selectOptions(
      screen.getByTestId('retailer-select'),
      OTHER_RETAILER
    );
    expect(screen.getByTestId('retailer')).toBeVisible();
    expect(screen.getByTestId('retailer-not-listed')).toBeVisible();
    expect(screen.getByLabelText('Status')).toHaveValue('true');

    // selecting "Meridian" should hide input element
    await userEvent.selectOptions(
      screen.getByTestId('retailer-select'),
      retailers[0]
    );
    expect(screen.queryByTestId('retailer')).toBeNull();
    expect(screen.queryByTestId('retailer-not-listed')).toBeNull();
    expect(screen.getByLabelText('Status')).toBeEnabled();
    expect(screen.getByLabelText('Status')).toHaveValue('true');

    // should submit the form with "Meridian" if " MERIDIAN " entered for other retailer
    await userEvent.selectOptions(
      screen.getByTestId('retailer-select'),
      OTHER_RETAILER
    );
    await userEvent.type(
      screen.getByTestId('retailer'),
      ` ${retailers[0].toUpperCase()} `
    );

    fireEvent.submit(screen.getByTestId('create-donation-form'));

    expect(Inertia.post).toHaveBeenCalledWith(
      '/donations',
      {
        icp: '',
        address: '',
        gps_coordinates: '',
        retailer: retailers[0],
        account_number: '',
        amount: '',
        is_dollar: true,
        buyback_rate: '0.00',
        is_active: true,
        user_id: '123',
      },
      expect.anything()
    );
  });

  it('posts the data to the expected endpoint on submit new donation', async () => {
    mockUsePermissions.mockReturnValue([false]); // [canViewUsers]

    render(<CreateDonation retailers={retailers} />);

    await userEvent.type(screen.getByLabelText('ICP*'), 'Foo');
    await userEvent.type(
      screen.getByLabelText('Donation Address'),
      '1 Example Street'
    );
    await userEvent.type(screen.getByLabelText('Donation GPS'), '123, 456');
    await userEvent.type(screen.getByLabelText('Donation Amount*'), '12.34');
    await userEvent.selectOptions(
      screen.getByTestId('retailer-select'),
      retailers[0]
    );
    await userEvent.type(
      screen.getByLabelText('Account Number*'),
      'new account number'
    );

    fireEvent.submit(screen.getByTestId('create-donation-form'));

    expect(Inertia.post).toHaveBeenCalledWith(
      '/donations',
      {
        icp: 'Foo',
        address: '1 Example Street',
        gps_coordinates: '123, 456',
        retailer: retailers[0],
        account_number: 'new account number',
        amount: '12.34',
        is_dollar: true,
        buyback_rate: '0.00',
        is_active: true,
        user_id: '123',
      },
      expect.anything()
    );
  });

  it('puts the data to the expected endpoint on submit existing donation with changed attributes', async () => {
    mockUsePermissions.mockReturnValue([true]); // [canViewUsers]
    donation.is_dollar = true;
    donation.amount = '12.34';
    donation.is_active = false;

    render(
      <CreateDonation
        donation={donation}
        donors={donors}
        retailers={retailers}
      />
    );

    await act(async () => {
      await userEvent.type(screen.getByLabelText('ICP*'), 'Foo');
      await userEvent.type(
        screen.getByLabelText('Donation Address'),
        'updated'
      );
      await userEvent.type(
        screen.getByLabelText('Donation GPS'),
        'updated gps'
      );
      await userEvent.type(
        screen.getByLabelText('Account Number*'),
        'updated account number'
      );
      await userEvent.selectOptions(
        screen.getByTestId('donation-type'),
        'false'
      );
      // check that changing the type resets the value to zero
      expect(screen.getByLabelText('Donation Amount*')).toHaveValue(0);
      await userEvent.type(screen.getByLabelText('Donation Amount*'), '56');
      await userEvent.clear(screen.getByLabelText('Buy-Back Rate*'));
      await userEvent.type(screen.getByLabelText('Buy-Back Rate*'), '0.42');
      await userEvent.selectOptions(screen.getByLabelText('Status'), 'true');
      await userEvent.click(screen.getByLabelText('Donor*'));
    });
    await act(async () => {
      await userEvent.click(screen.getByText(donors[1].name));
    });

    fireEvent.submit(screen.getByTestId('create-donation-form'));

    expect(Inertia.put).toHaveBeenCalledWith(
      `/donations/${donation.id}`,
      {
        icp: donation.icp + 'Foo',
        address: donation.address + 'updated',
        gps_coordinates: donation.gps_coordinates + 'updated gps',
        retailer: donation.retailer,
        account_number: donation.account_number + 'updated account number',
        amount: '56',
        is_dollar: false,
        buyback_rate: '0.42',
        is_active: true,
        user_id: donors[1].id.toString(),
      },
      expect.anything()
    );
  });

  it('renders error messages for any invalid fields', () => {
    mockUsePermissions.mockReturnValue([true]); // [canViewUsers]

    const errors = {
      icp: 'icp invalid',
      address: 'address invalid',
      gps_coordinates: 'gps_coordinates invalid',
      retailer: 'retailer invalid',
      account_number: 'account_number invalid',
      amount: 'amount invalid',
      is_active: 'is_active invalid',
      user_id: 'invalid user',
    };

    const mockInertiaPost = Inertia.post as jest.Mock;
    mockInertiaPost.mockImplementationOnce((url, data, { onError }) => {
      onError(errors);
    });

    render(<CreateDonation retailers={retailers} />);
    fireEvent.submit(screen.getByTestId('create-donation-form'));

    Object.values(errors).forEach((message) => {
      expect(screen.getByText(message)).toBeVisible();
    });
  });

  it('renders error message for invalid buy-back rate', () => {
    mockUsePermissions.mockReturnValue([true]); // [canViewUsers]

    donation.is_dollar = false;
    donation.buyback_rate = '-0.42';

    const errors = {
      buyback_rate: 'buyback_rate invalid',
    };

    const mockInertiaPost = Inertia.post as jest.Mock;
    mockInertiaPost.mockImplementationOnce((url, data, { onError }) => {
      data['is_dollar'] = false;
      onError(errors);
    });

    render(<CreateDonation retailers={retailers} />);
    fireEvent.submit(screen.getByTestId('create-donation-form'));

    expect(screen.getByText('buyback_rate invalid')).toBeVisible();
  });

  it('displays a loading spinner while the form is submitting', () => {
    mockUsePermissions.mockReturnValue([false]); // [canViewUsers]

    const mockInertiaPost = Inertia.post as jest.Mock;
    mockInertiaPost.mockImplementationOnce((url, data, { onStart }) => {
      onStart();
    });

    render(<CreateDonation retailers={retailers} />);

    fireEvent.submit(screen.getByTestId('create-donation-form'));
    const button = document.querySelector('button[type="submit"]');
    expect(button).toHaveAttribute('data-loading');
    expect(button).toBeDisabled();
  });
});
