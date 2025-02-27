import { render, screen } from '@testing-library/react';
import React from 'react';
import { PastDonationFactory } from 'src/Types/PastDonation';
import { PaginatorFactory } from 'src/Types/Paginator';
import PastDonations from 'src/Pages/PastDonations/PastDonations';

describe('The admin past donations screen', () => {
  const pastDonations = PastDonationFactory.buildList(3);
  const paginator = PaginatorFactory.build({
    data: pastDonations,
  });

  it('renders past donations list', async () => {
    render(<PastDonations pastDonationsPaginator={paginator} />);

    expect(screen.getByText('History')).toBeVisible();
    expect(screen.getByText(pastDonations[0].icp)).toBeVisible();
  });
});
