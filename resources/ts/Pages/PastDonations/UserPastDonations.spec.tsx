import { render, screen } from '@testing-library/react';
import React from 'react';
import { PastDonationFactory } from 'src/Types/PastDonation';
import { PaginatorFactory } from 'src/Types/Paginator';
import UserPastDonations from 'src/Pages/PastDonations/UserPastDonations';
import { UserFactory } from 'src/Types/User';

describe('The donor past donations screen', () => {
  const pastDonations = PastDonationFactory.buildList(3);
  const paginator = PaginatorFactory.build({
    data: pastDonations,
  });

  const user = UserFactory.build();

  it('renders past donations list', async () => {
    render(
      <UserPastDonations
        pastDonationsPaginator={paginator}
        user={user}
        currentTab="history"
      />
    );

    expect(screen.getByText('DONATION HISTORY')).toBeVisible();
    expect(screen.getByText(pastDonations[0].icp)).toBeVisible();
  });
});
