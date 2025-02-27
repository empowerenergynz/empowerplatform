/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-explicit-any */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AppLayout from 'src/Layouts/AppLayout';
import Credits from 'src/Pages/Credits/Credits';
import { CreditFactory, CreditStatus } from 'src/Types/Credit';
import { PaginatorFactory } from 'src/Types/Paginator';
import { AgencyFactory } from 'src/Types/Agency';
import { RetailerFactory } from 'src/Types/Retailer';
import useCreditsQuery from 'src/Hooks/Queries/useCreditsQuery';
import userEvent from '@testing-library/user-event';
import * as lib from 'src/lib';
import { data } from 'src/Pages/Credits/__data__/data';
import { DistrictFactory, RegionFactory } from 'src/Types/Region';
import { createStandaloneToast } from '@chakra-ui/toast';
import { Inertia } from '@inertiajs/inertia';
import { addBom } from 'src/lib';
import { Permissions } from 'src/Types/Permission';

jest.mock('src/Layouts/AppLayout');
jest.mock('@inertiajs/inertia');
jest.mock('src/Hooks/Queries/useCreditsQuery');

const { ToastContainer } = createStandaloneToast();

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

describe('The Credits page', () => {
  const credits = CreditFactory.buildList(4);
  credits.forEach((credit, i) => {
    credit.agency = AgencyFactory.build({ name: `Agency ${i}` });
    credit.retailer = RetailerFactory.build({ name: `Retailer ${i}` });
    credit.status = i;
    credit.amount = (i + 1) * 100;
  });
  // use Date().toISOString() so the test environment's TZ gets embedded:
  credits[0].created_at = new Date('2004-01-02T13:45').toISOString();
  credits[CreditStatus.EXPORTED].exported_date = new Date(
    '2023-01-02T13:45'
  ).toISOString();

  const creditsPaginator = PaginatorFactory.build({
    data: credits,
  });

  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  const filterStatus = jest.fn();
  const status = '';
  const mockUseCreditsQuery = useCreditsQuery as jest.Mock;
  mockUseCreditsQuery.mockImplementation(() => {
    return {
      filterStatus,
      status,
    };
  });

  it('hides elements from agency admin', async () => {
    permissions = [Permissions.VIEW_AGENCY_CREDITS];

    render(<Credits creditsPaginator={creditsPaginator} />);

    expect(screen.getByText('13:45 02/01/2004')).toBeVisible(); // created at
    expect(screen.queryByText('Agency 1')).toBeNull();
    expect(screen.getByText('Retailer 1')).toBeVisible();
    expect(screen.getByText(credits[0].name)).toBeVisible();
    expect(screen.getByText('$100')).toBeVisible();
    expect(screen.getAllByText('Requested')).toHaveLength(2); // also one in the drop-down
    expect(screen.getByText('(13:45 02/01/2023)')).toBeVisible(); // exported date

    expect(screen.queryAllByRole('checkbox')).toHaveLength(0); // no selection possible

    expect(screen.getByTestId('paginator')).toBeVisible();
  });

  it('displays credits in the table', async () => {
    permissions = [Permissions.VIEW_ALL_CREDITS];

    render(<Credits creditsPaginator={creditsPaginator} />);

    expect(screen.getByText('13:45 02/01/2004')).toBeVisible(); // created at
    expect(screen.getByText('Agency 1')).toBeVisible();
    expect(screen.getByText('Retailer 1')).toBeVisible();
    expect(screen.getByText(credits[0].name)).toBeVisible();
    expect(screen.getByText('$100')).toBeVisible();
    expect(screen.getAllByText('Requested')).toHaveLength(3); // also two in the drop-downs
    expect(screen.getByText('(13:45 02/01/2023)')).toBeVisible(); // exported date

    expect(screen.getByTestId('paginator')).toBeVisible();
  });

  it("calls filterStatus when filter's dropdown value is changed", async () => {
    permissions = [Permissions.VIEW_ALL_CREDITS];

    render(<Credits creditsPaginator={creditsPaginator} />);

    const selectBox = await screen.findByTestId('credit-status-filter');
    await userEvent.selectOptions(selectBox, 'Exported');
    expect(filterStatus).toHaveBeenCalledWith(CreditStatus.EXPORTED.toString());
  });

  it('allows rows to be selected but not different statuses together', async () => {
    permissions = [Permissions.VIEW_ALL_CREDITS];

    render(<Credits creditsPaginator={creditsPaginator} />);

    const requestedCheckBox = screen
      .getByTestId('credit-checkbox-' + credits[CreditStatus.REQUESTED].id)
      .querySelector('input')!;
    expect(requestedCheckBox).toBeVisible();
    expect(requestedCheckBox).toBeEnabled();

    const exportedCheckBox = screen
      .getByTestId('credit-checkbox-' + credits[CreditStatus.EXPORTED].id)
      .querySelector('input')!;
    expect(exportedCheckBox).toBeVisible();
    expect(exportedCheckBox).toBeEnabled();

    const paidCheckBox = screen
      .getByTestId('credit-checkbox-' + credits[CreditStatus.PAID].id)
      .querySelector('input');
    expect(paidCheckBox).toBeVisible();
    expect(paidCheckBox).toBeEnabled();

    const rejectedCheckBox = screen
      .getByTestId('credit-checkbox-' + credits[CreditStatus.REJECTED].id)
      .querySelector('input');
    expect(rejectedCheckBox).toBeVisible();
    expect(rejectedCheckBox).toBeEnabled();

    // checking one status should disable the others
    fireEvent.click(requestedCheckBox);
    expect(requestedCheckBox).toBeChecked();
    expect(exportedCheckBox).toBeDisabled();
    expect(paidCheckBox).toBeDisabled();
    expect(rejectedCheckBox).toBeDisabled();
  });

  it('can select rows using the Status menu', async () => {
    permissions = [Permissions.VIEW_ALL_CREDITS];

    render(<Credits creditsPaginator={creditsPaginator} />);

    const requestedCheckBox = screen
      .getByTestId('credit-checkbox-' + credits[CreditStatus.REQUESTED].id)
      .querySelector('input')!;
    const exportedCheckBox = screen
      .getByTestId('credit-checkbox-' + credits[CreditStatus.EXPORTED].id)
      .querySelector('input')!;

    fireEvent.change(screen.getByTestId('credit-select-filter'), {
      target: { value: 'Requested' },
    });

    expect(requestedCheckBox).toBeChecked();
    expect(requestedCheckBox).toBeEnabled();

    expect(exportedCheckBox).not.toBeChecked();
    expect(exportedCheckBox).toBeDisabled();

    fireEvent.change(screen.getByTestId('credit-select-filter'), {
      target: { value: 'Exported (all)' },
    });

    expect(requestedCheckBox).not.toBeChecked();
    expect(requestedCheckBox).toBeDisabled();

    expect(exportedCheckBox).toBeChecked();
    expect(exportedCheckBox).toBeEnabled();

    fireEvent.change(screen.getByTestId('credit-select-filter'), {
      target: { value: 'None' },
    });

    expect(requestedCheckBox).not.toBeChecked();
    expect(requestedCheckBox).toBeEnabled();

    expect(exportedCheckBox).not.toBeChecked();
    expect(exportedCheckBox).toBeEnabled();

    fireEvent.change(screen.getByTestId('credit-select-filter'), {
      target: { value: 'Exported 13:45 02/01/2023' },
    });

    expect(requestedCheckBox).not.toBeChecked();
    expect(requestedCheckBox).toBeDisabled();

    expect(exportedCheckBox).toBeChecked();
    expect(exportedCheckBox).toBeEnabled();
  });

  it('exports contacts and credits for Xero', async () => {
    permissions = [Permissions.VIEW_ALL_CREDITS];

    const credit = credits[CreditStatus.REQUESTED];
    credit.retailer!.email = 'test@retailer.com';
    credit.retailer!.account_name = 'Elec Bank Account';
    credit.retailer!.account_number = '01-12340-11230-00';
    credit.retailer!.particulars = '_i_j _surname'; // should become FM ReallyLon
    credit.retailer!.code = 'CC_year7890123'; // should become CC2003789012
    credit.retailer!.reference = '_accountNo'; // should get trunctead to 123456789012
    credit.name = 'First Middle ReallyLongSurname'; // should get truncated to 12 chars
    credit.account = '12345678901234';
    credit.region = RegionFactory.build({ name: 'Canterbury' });
    credit.district = DistrictFactory.build({ name: 'Selwyn' });
    render(
      <>
        <Credits creditsPaginator={creditsPaginator} />
        <ToastContainer />
      </>
    );

    // spy on the saveFile method
    const spy = jest.spyOn(lib, 'saveFile').mockImplementation(() => true);

    // mock the change status API
    const mockInertiaPut = Inertia.put as jest.Mock;
    mockInertiaPut.mockImplementationOnce(() => [200, {}]);

    // select one file
    const requestedCheckBox = screen
      .getByTestId('credit-checkbox-' + credit.id)
      .querySelector('input')!;
    fireEvent.click(requestedCheckBox);

    // click the export button
    fireEvent.click(screen.getByText('Export Contacts and Credits for Xero'));

    expect(spy).toHaveBeenCalledWith(
      addBom(data.contacts),
      expect.stringMatching(/contacts_.*/),
      'text/csv'
    );
    expect(spy).toHaveBeenCalledWith(
      addBom(data.credits),
      expect.stringMatching(/bill_credits_.*/),
      'text/csv'
    );

    // shows the first toast
    expect(screen.getByText('2 files saved')).toBeInTheDocument();

    // check the status gets updated
    expect(mockInertiaPut).toHaveBeenCalledWith(
      '/credits/updateManyStatus',
      {
        ids: [credit.id],
        status: CreditStatus.EXPORTED,
        admin_notes: '',
      },
      expect.anything()
    );
  });

  it('marks rows as paid', async () => {
    permissions = [Permissions.VIEW_ALL_CREDITS];

    const credit = credits[CreditStatus.EXPORTED];
    render(<Credits creditsPaginator={creditsPaginator} />);

    // mock the change status API
    const mockInertiaPut = Inertia.put as jest.Mock;
    mockInertiaPut.mockImplementationOnce(() => [200, {}]);

    // select one file
    const requestedCheckBox = screen
      .getByTestId('credit-checkbox-' + credit.id)
      .querySelector('input')!;
    fireEvent.click(requestedCheckBox);

    // click the Mark as Paid button
    fireEvent.click(screen.getByText('Mark as Paid'));

    // check the status gets updated
    expect(mockInertiaPut).toHaveBeenCalledWith(
      '/credits/updateManyStatus',
      {
        ids: [credit.id],
        status: CreditStatus.PAID,
        admin_notes: '',
      },
      expect.anything()
    );
  });

  it('marks rows as rejected', async () => {
    permissions = [Permissions.VIEW_ALL_CREDITS];

    const credit = credits[CreditStatus.EXPORTED];
    render(<Credits creditsPaginator={creditsPaginator} />);

    // mock the change status API
    const mockInertiaPut = Inertia.put as jest.Mock;
    mockInertiaPut.mockImplementationOnce(() => [200, {}]);

    // select one file
    const requestedCheckBox = screen
      .getByTestId('credit-checkbox-' + credit.id)
      .querySelector('input')!;
    fireEvent.click(requestedCheckBox);

    // click the Mark as Paid button
    fireEvent.click(screen.getByText('Reject'));

    expect(screen.getByTestId('modal-title')).toHaveTextContent(
      'Reject Credit(s)'
    );
    fireEvent.change(screen.getByLabelText('Rejection Reason*'), {
      target: { value: 'Invalid account' },
    });
    fireEvent.click(screen.getByTestId('reject-submit-btn'));

    // check the status gets updated
    expect(mockInertiaPut).toHaveBeenCalledWith(
      '/credits/updateManyStatus',
      {
        ids: [credit.id],
        status: CreditStatus.REJECTED,
        admin_notes: 'Invalid account',
      },
      expect.anything()
    );
  });
});
