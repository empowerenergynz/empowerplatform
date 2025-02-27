/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AppLayout from 'src/Layouts/AppLayout';
import { Inertia } from '@inertiajs/inertia';
import { RegionFactory } from 'src/Types/Region';
import { RetailerFactory } from 'src/Types/Retailer';
import CreateCredit from 'src/Pages/Credits/CreateCredit';

jest.mock('src/Layouts/AppLayout');
jest.mock('@inertiajs/inertia');

describe('The CreateCredit form', () => {
  const regions = RegionFactory.buildList(3);
  const region = regions[0];
  const district = region.districts![0];
  const retailers = RetailerFactory.buildList(3);
  const approvedAmounts = ['100', '200', '300'];

  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  it('posts the data to the expected endpoint on submit new credit with custom amount', async () => {
    render(
      <CreateCredit
        regions={regions}
        retailers={retailers}
        approvedAmounts={approvedAmounts}
      />
    );

    fireEvent.change(screen.getByLabelText('Client Name*'), {
      target: { value: 'Bob Smith' },
    });
    fireEvent.change(screen.getByLabelText('Account Number*'), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText('Retailer*'), {
      target: { value: retailers[0].id },
    });
    fireEvent.change(screen.getByLabelText('Region*'), {
      target: { value: region!.id },
    });
    fireEvent.change(screen.getByLabelText('District*'), {
      target: { value: district!.id },
    });
    fireEvent.click(screen.getByText('Custom'));
    fireEvent.change(screen.getByTestId('amount'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByLabelText('Notes*'), {
      target: { value: 'a custom amount' },
    });

    fireEvent.submit(screen.getByTestId('create-credit-form'));
    expect(Inertia.post).toHaveBeenCalledWith(
      '/credits',
      {
        name: 'Bob Smith',
        amount: '123',
        account: '123456',
        notes: 'a custom amount',
        region_id: region.id.toString(),
        district_id: district.id.toString(),
        retailer_id: retailers[0].id.toString(),
      },
      expect.anything()
    );
  });

  it("doesn't show amount or require notes for approved amount", async () => {
    render(
      <CreateCredit
        regions={regions}
        retailers={retailers}
        approvedAmounts={approvedAmounts}
      />
    );

    fireEvent.click(screen.getByText('$100'));
    expect(screen.queryByTestId('amount')).toBeNull();
    expect(screen.queryByLabelText('Notes*')).toBeNull();
    expect(screen.getByLabelText('Notes')).toBeVisible();
  });

  it('displays the AlertDialog if the balance is less than the amount', async () => {
    render(
      <CreateCredit
        regions={regions}
        retailers={retailers}
        approvedAmounts={approvedAmounts}
        balance={100}
      />
    );

    fireEvent.change(screen.getByLabelText('Client Name*'), {
      target: { value: 'Bob Smith' },
    });
    fireEvent.change(screen.getByLabelText('Account Number*'), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText('Retailer*'), {
      target: { value: retailers[0].id },
    });
    fireEvent.change(screen.getByLabelText('Region*'), {
      target: { value: region!.id },
    });
    fireEvent.change(screen.getByLabelText('District*'), {
      target: { value: district!.id },
    });
    fireEvent.click(screen.getByText('Custom'));
    fireEvent.change(screen.getByTestId('amount'), {
      target: { value: '200' },
    });
    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: 'a custom amount' },
    });

    fireEvent.submit(screen.getByTestId('create-credit-form'));
    await waitFor(() => {
      expect(
        screen.getByText('Credit request exceeds available budget')
      ).toBeVisible();
    });
  });
});
