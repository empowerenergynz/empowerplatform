import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import CreatePastDonationModal from 'src/Pages/PastDonations/CreatePastDonationModal';
import { DonationFactory } from 'src/Types/Donation';
import userEvent from '@testing-library/user-event';
import { Inertia } from '@inertiajs/inertia';

// eslint-disable-next-line @typescript-eslint/no-empty-function
let onSuccess = () => {};

jest.mock('@inertiajs/inertia', () => ({
  ...jest.requireActual('@inertiajs/inertia'),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Inertia: {
    post: jest.fn((url, data, options) => {
      onSuccess = options.onSuccess;
    }),
  },
}));

describe('The create past donation modal', () => {
  beforeEach(() => jest.clearAllMocks());

  const donation = DonationFactory.build();

  const onClose = jest.fn();
  const date = new Date().toISOString().split('T')[0];

  const renderAndWaitToOpen = async () => {
    render(<CreatePastDonationModal donation={donation} onClose={onClose} />);
    await waitFor(() =>
      expect(screen.queryByTestId('modal-title')).toBeVisible()
    );
  };

  it('renders modal with donation data pre-filled', async () => {
    donation.is_dollar = true;
    await renderAndWaitToOpen();

    expect(screen.getByTestId('modal-title')).toHaveTextContent(
      'Record Donation'
    );
    expect(screen.getByLabelText('ICP*')).toHaveValue(donation.icp);
    expect(screen.getByLabelText('Date*')).toHaveValue(date);
    expect(screen.getByLabelText('Account Number*')).toHaveValue(
      donation.account_number
    );
    expect(screen.getByLabelText('Donation Amount*')).toHaveValue(
      parseFloat(donation.amount)
    );
    expect(screen.getByText('Cancel')).toBeVisible();
    expect(screen.getByText('Save')).toBeVisible();
    expect(screen.getByTestId('record-donation-modal')).not.toHaveTextContent(
      'Should be'
    );
  });

  it('renders modal with a percent donation', async () => {
    donation.is_dollar = false;
    donation.buyback_rate = '0.42';
    await renderAndWaitToOpen();

    expect(screen.getByLabelText('Donation Amount*')).toHaveValue(null);
    expect(screen.getByTestId('record-donation-modal')).toHaveTextContent(
      'Should be'
    );
    expect(
      screen.getByText(
        `Should be ${parseFloat(
          donation.amount
        )}% of buy back; buy-back rate is $0.42.`
      )
    ).toBeVisible();
  });

  it('posts the data to the expected endpoint and calls the onClose callback', async () => {
    await renderAndWaitToOpen();
    await userEvent.type(screen.getByLabelText('ICP*'), 'updated');
    await userEvent.type(screen.getByLabelText('Account Number*'), 'updated');
    await userEvent.clear(screen.getByLabelText('Donation Amount*'));
    await userEvent.type(screen.getByLabelText('Donation Amount*'), '123.45');
    await userEvent.click(screen.getByText('Save'));

    expect(Inertia.post).toHaveBeenCalledWith(
      `/donations/${donation.id}/history`,
      {
        icp: donation.icp + 'updated',
        account_number: donation.account_number + 'updated',
        date,
        amount: '123.45',
      },
      expect.anything()
    );

    expect(onClose).not.toHaveBeenCalled();

    // call the success function
    await act(() => onSuccess());
    expect(onClose).toHaveBeenCalled();
  });

  it('prompts the user before closing the modal', async () => {
    await renderAndWaitToOpen();
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText('Cancel'));

    await waitFor(() =>
      expect(screen.queryByTestId('delete-modal')).toBeVisible()
    );
    expect(screen.getByText('Are you sure you want to cancel?')).toBeVisible();

    await userEvent.click(screen.getByTestId('delete-confirm-btn'));
    expect(onClose).toHaveBeenCalled();
  });

  it('prompts the user before closing via a click on the container and cancels alert', async () => {
    await renderAndWaitToOpen();
    expect(onClose).not.toHaveBeenCalled();
    const container = screen
      .getByTestId('record-donation-modal')
      .closest('.chakra-portal')
      ?.querySelector('.chakra-modal__content-container');
    expect(container).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await userEvent.click(container!);

    await waitFor(() =>
      expect(screen.queryByTestId('delete-modal')).toBeVisible()
    );
    expect(screen.getByText('Are you sure you want to cancel?')).toBeVisible();

    await userEvent.click(screen.getByTestId('delete-cancel-btn'));
    expect(onClose).not.toHaveBeenCalled();

    await waitFor(() =>
      expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument()
    );
    expect(screen.queryByText('Are you sure you want to cancel?')).toBeNull();
  });

  it('renders error messages for any invalid fields', async () => {
    const errors = {
      icp: 'icp invalid',
      account_number: 'account_number invalid',
      amount: 'amount invalid',
      date: 'date invalid',
    };

    const mockInertiaPost = Inertia.post as jest.Mock;
    mockInertiaPost.mockImplementationOnce((url, data, { onError }) => {
      onError(errors);
    });

    await renderAndWaitToOpen();
    await userEvent.click(screen.getByText('Save'));

    Object.values(errors).forEach((message) => {
      expect(screen.getByText(message)).toBeVisible();
    });
  });
});
