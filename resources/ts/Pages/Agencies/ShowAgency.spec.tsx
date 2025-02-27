/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Permissions } from 'src/Types/Permission';
import { AgencyFactory } from 'src/Types/Agency';
import ShowAgency from 'src/Pages/Agencies/ShowAgency';
import { DistrictFactory, RegionFactory } from 'src/Types/Region';

let permissions: Permissions[] = [];

jest.mock('@inertiajs/inertia-react', () => ({
  ...jest.requireActual('@inertiajs/inertia-react'),
  usePage: jest.fn(() => ({
    props: {
      authUser: {
        name: 'Jake Perolta',
        first_name: 'Jake',
        last_name: 'Perolta',
        email: 'jake@b99.com',
        permissions,
      },
    },
  })),
}));

describe('The show agency screen', () => {
  const agency = AgencyFactory.build();
  agency.balance = 1234321;
  // use .toISOString() here to add the local timezone for the test environment
  agency.balance_date = new Date('2023-05-03T14:34').toISOString();
  agency.region = RegionFactory.build({ name: 'Test Region' });
  agency.district = DistrictFactory.build({ name: 'Test District' });
  const liveBalance = 4567;

  it('renders show agency', async () => {
    render(<ShowAgency agency={agency} liveBalance={liveBalance} />);
    expect(screen.getAllByText(agency.name)).toHaveLength(2); // including the page title
    expect(screen.getByText('$ 1,234,321')).toBeVisible();
    expect(screen.getByText(`(as at 14:34 03/05/2023)`)).toBeVisible();
    expect(screen.getByText('Test Region')).toBeVisible();
    expect(screen.getByText('Test District')).toBeVisible();
    expect(screen.getByText('$ 4,567')).toBeVisible();
  });

  it('renders Edit Agency button if user has permission', async () => {
    permissions = [Permissions.EDIT_AGENCIES];
    render(<ShowAgency agency={agency} liveBalance={liveBalance} />);
    const editUserButton = screen.getByText('Edit');
    expect(editUserButton).toBeVisible();
  });
});
