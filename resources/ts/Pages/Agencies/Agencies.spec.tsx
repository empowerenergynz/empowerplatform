/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, screen } from '@testing-library/react';
import React from 'react';
import AppLayout from 'src/Layouts/AppLayout';
import userEvent from '@testing-library/user-event';
import useAgenciesQuery from 'src/Hooks/Queries/useAgenciesQuery';
import { PaginatorFactory } from 'src/Types/Paginator';
import { Inertia } from '@inertiajs/inertia';
import { AgencyFactory } from 'src/Types/Agency';
import Agencies from 'src/Pages/Agencies/Agencies';
import { Permissions } from 'src/Types/Permission';
import { DistrictFactory, RegionFactory } from 'src/Types/Region';

jest.mock('src/Layouts/AppLayout');
jest.mock('src/Hooks/Queries/useAgenciesQuery');

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

describe('The agencies list page', () => {
  afterEach(() => jest.clearAllMocks());

  const agencies = AgencyFactory.buildList(3);
  agencies[0].name = 'Agency 0';
  agencies[0].balance = 1234321;
  agencies[0].region = RegionFactory.build({ name: 'Region 0' });
  agencies[0].district = DistrictFactory.build({ name: 'District 0' });
  const agenciesPaginator = PaginatorFactory.build({
    data: agencies,
  });

  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  const setSearch = jest.fn();
  const mockUseAgenciesQuery = useAgenciesQuery as jest.Mock;
  mockUseAgenciesQuery.mockImplementation(() => {
    return {
      setSearch,
    };
  });

  it('shows Agency name, district and region', async () => {
    render(<Agencies agenciesPaginator={agenciesPaginator} />);

    expect(screen.getByText('Agency 0')).toBeVisible();
    expect(screen.getByText('$ 1,234,321')).toBeVisible();
    expect(screen.getByText('Region 0')).toBeVisible();
    expect(screen.getByText('District 0')).toBeVisible();
    expect(screen.getAllByText('(Nationwide)')).toHaveLength(2);
  });

  it("calls setSearch when filter's input value is changed", async () => {
    render(<Agencies agenciesPaginator={agenciesPaginator} />);

    await userEvent.type(screen.getByLabelText('Search agencies'), 'Foo');
    expect(setSearch).toHaveBeenCalledWith('Foo');
  });

  it("shows the 'Add Agency' button when users have permission to create agencies", () => {
    permissions = [Permissions.CREATE_AGENCIES];

    render(<Agencies agenciesPaginator={agenciesPaginator} />);

    expect(screen.getByText('Add Agency')).toBeVisible();
  });

  it("does not display the 'Add Agency' button when users do not have permission to create agencies", () => {
    permissions = [];

    render(<Agencies agenciesPaginator={agenciesPaginator} />);

    expect(screen.queryByText('Add Agency')).toBeNull();
  });

  it('allows viewing an agency', async () => {
    const agency = agencies[0];
    jest.spyOn(Inertia, 'visit');
    render(<Agencies agenciesPaginator={agenciesPaginator} />);

    await userEvent.click(screen.getByText(agency.name));
    expect(Inertia.visit).toHaveBeenCalledWith(`/agencies/${agency.id}`);
  });
});
