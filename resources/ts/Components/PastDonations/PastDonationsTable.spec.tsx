import React from 'react';
import { render, screen } from '@testing-library/react';
import PastDonationsTable from 'src/Components/PastDonations/PastDonationsTable';
import { PaginatorFactory } from 'src/Types/Paginator';
import { PastDonationFactory } from 'src/Types/PastDonation';

describe('The past donations table', () => {
  const pastDonations = PastDonationFactory.buildList(3);
  const paginator = PaginatorFactory.build({
    data: pastDonations,
  });

  it('renders donations table with correct columns', async () => {
    render(<PastDonationsTable pastDonationsPaginator={paginator} />);

    expect(screen.getByText('ICP')).toBeVisible();
    expect(screen.getByText('Donation Date')).toBeVisible();
    expect(screen.getByText('Donation Amount')).toBeVisible();
    expect(screen.getByText('Account Number')).toBeVisible();
    expect(screen.getByText('Retailer')).toBeVisible();

    for (const pastDonation of pastDonations) {
      expect(screen.getByText(pastDonation.icp)).toBeVisible();
      expect(
        screen.getByText(pastDonation.date.split('-').reverse().join('/'))
      ).toBeVisible();
      expect(screen.getByText('$' + pastDonation.amount)).toBeVisible();
      expect(screen.getByText(pastDonation.account_number)).toBeVisible();
      expect(
        screen.getByText(pastDonation.donation?.retailer || '')
      ).toBeVisible();
    }

    expect(screen.queryByText('No Past Donations')).toBeNull();
  });

  it('renders donations table with priority to retailer of past donation', async () => {
    pastDonations[0].retailer = 'Override Energy';

    render(<PastDonationsTable pastDonationsPaginator={paginator} />);

    for (const pastDonation of pastDonations) {
      if (pastDonation.retailer) {
        expect(screen.getByText(pastDonation.retailer)).toBeVisible();
      } else {
        expect(
          screen.getByText(pastDonation.donation?.retailer || '')
        ).toBeVisible();
      }
    }

    expect(screen.queryByText('No Past Donations')).toBeNull();
  });

  it('renders empty donations table', async () => {
    paginator.data = [];

    render(<PastDonationsTable pastDonationsPaginator={paginator} />);

    expect(screen.getByText('No Past Donations')).toBeVisible();
  });
});
