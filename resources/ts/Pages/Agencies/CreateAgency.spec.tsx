/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AppLayout from 'src/Layouts/AppLayout';
import { Inertia } from '@inertiajs/inertia';
import { AgencyFactory } from 'src/Types/Agency';
import CreateAgency from 'src/Pages/Agencies/CreateAgency';
import { RegionFactory } from 'src/Types/Region';

jest.mock('src/Layouts/AppLayout');
jest.mock('@inertiajs/inertia');

describe('The CreateAgency form', () => {
  const regions = RegionFactory.buildList(3);
  const region = regions[0];
  const district = region.districts![0];
  const agency = AgencyFactory.build({
    name: 'Test Agency',
    balance: 6789,
    balance_date: new Date('1999-05-03T15:34').toISOString(),
    region,
    region_id: region.id,
    district: district,
    district_id: district.id,
  });
  const liveBalance = 1234;

  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  const mockedNewDate = new Date('2023-01-02T15:23');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockedNewDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders create agency', async () => {
    render(<CreateAgency regions={regions} />);

    expect(screen.getByLabelText('Name*')).toHaveValue('');
    expect(screen.getByLabelText('Balance*')).toHaveValue(0);
    expect(screen.getByLabelText('Balance Date*')).toHaveValue(
      '2023-01-02T15:23'
    );
    expect(screen.getByLabelText('Region')).toHaveValue('');
    expect(screen.getByLabelText('District')).toHaveValue('');
    expect(screen.getByLabelText('District')).toBeDisabled();
    expect(screen.queryByText('Balance Datum')).toBeNull();
    expect(screen.queryByText('Calculated "Live" Balance')).toBeNull();
  });

  it('renders edit agency', async () => {
    render(
      <CreateAgency
        agency={agency}
        regions={regions}
        liveBalance={liveBalance}
      />
    );

    expect(screen.getByLabelText('Name*')).toHaveValue(agency.name);
    expect(screen.getByLabelText('New Balance Datum*')).toHaveValue(
      agency.balance
    );
    expect(screen.getByLabelText('Balance Date*')).toHaveValue(
      '1999-05-03T15:34'
    );
    expect(screen.getByLabelText('Region')).toHaveValue(
      agency.region?.id.toString()
    );
    expect(screen.getByLabelText('District')).toHaveValue(
      agency.district?.id.toString()
    );
    expect(screen.getByLabelText('District')).toBeEnabled();
    expect(screen.getByText('Balance Datum')).toBeVisible();
    expect(screen.getByText('Calculated "Live" Balance')).toBeVisible();
    expect(screen.getByText('$ 1,234')).toBeVisible();
    expect(screen.getByText(`(as at 15:34 03/05/1999)`)).toBeVisible();
  });

  it('posts the data to the expected endpoint on submit new agency', async () => {
    render(<CreateAgency regions={regions} />);

    fireEvent.change(screen.getByLabelText('Name*'), {
      target: { value: agency.name },
    });
    fireEvent.change(screen.getByLabelText('Balance*'), {
      target: { value: 456 },
    });
    fireEvent.change(screen.getByLabelText('Region'), {
      target: { value: agency.region!.id },
    });
    fireEvent.change(screen.getByLabelText('District'), {
      target: { value: agency.district!.id },
    });

    fireEvent.submit(screen.getByTestId('create-agency-form'));
    expect(Inertia.post).toHaveBeenCalledWith(
      '/agencies',
      {
        name: agency.name,
        balance: '456',
        balance_date: mockedNewDate.toISOString(),
        region_id: agency.region!.id.toString(),
        district_id: agency.district!.id.toString(),
      },
      expect.anything()
    );
  });

  it('puts the data to the expected endpoint on submit existing agency', async () => {
    render(<CreateAgency agency={agency} regions={regions} />);
    fireEvent.change(screen.getByLabelText('Name*'), {
      target: { value: 'New Name' },
    });
    fireEvent.change(screen.getByLabelText('New Balance Datum*'), {
      target: { value: 456 },
    });
    const newRegion = regions[2];
    fireEvent.change(screen.getByLabelText('Region'), {
      target: { value: newRegion.id },
    });
    fireEvent.change(screen.getByLabelText('District'), {
      target: { value: newRegion.districts![0].id },
    });

    fireEvent.submit(screen.getByTestId('create-agency-form'));
    expect(Inertia.put).toHaveBeenCalledWith(
      `/agencies/${agency.id}`,
      {
        name: 'New Name',
        balance: '456',
        balance_date: mockedNewDate.toISOString(),
        region_id: newRegion.id.toString(),
        district_id: newRegion.districts![0].id.toString(),
      },
      expect.anything()
    );
  });

  it('renders error messages for any invalid fields', () => {
    const errors = {
      name: 'invalid name',
      region_id: 'invalid region',
      district_id: 'invalid district',
    };

    const mockInertiaPost = Inertia.post as jest.Mock;
    mockInertiaPost.mockImplementationOnce((url, data, { onError }) => {
      onError(errors);
    });

    render(<CreateAgency regions={regions} />);
    fireEvent.submit(screen.getByTestId('create-agency-form'));

    expect(screen.getByText(errors.name)).toBeVisible();
    expect(screen.getByText(errors.region_id)).toBeVisible();
    expect(screen.getByText(errors.district_id)).toBeVisible();
  });

  it('displays a loading spinner while the form is submitting', () => {
    const mockInertiaPost = Inertia.post as jest.Mock;
    mockInertiaPost.mockImplementationOnce((url, data, { onStart }) => {
      onStart();
    });
    render(<CreateAgency regions={regions} />);
    fireEvent.submit(screen.getByTestId('create-agency-form'));
    const button = document.querySelector('button[type="submit"]');
    expect(button).toHaveAttribute('data-loading');
    expect(button).toBeDisabled();
  });
});
