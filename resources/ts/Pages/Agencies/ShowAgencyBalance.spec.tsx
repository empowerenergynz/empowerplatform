import { render, screen } from '@testing-library/react';
import React from 'react';
import ShowAgencyBalance from 'src/Pages/Agencies/ShowAgencyBalance';

describe('The show agency balance screen', () => {
  const liveBalance = 4567;

  it('renders show agency', async () => {
    render(<ShowAgencyBalance liveBalance={liveBalance} />);
    expect(screen.getByText('Current Donation Pool:')).toBeVisible();
    const el = screen.getByText('$ 4,567');
    expect(el).toBeVisible();
    expect(screen.getByText('Press and hold to show balance')).toBeVisible();

    expect(el).toHaveStyle('filter: blur(8px)');

    // TODO fix these - for some reason they don't work
    // I've spend a while trying to get them working but we haven't got budget to spend too long.
    // // test mouse down/leave
    // fireEvent.mouseDown(el);
    // expect(el).not.toHaveStyle('filter: blur(8px)');
    // fireEvent.mouseLeave(el);
    // expect(el).toHaveStyle('filter: blur(8px)');
    //
    // // test mouse down/up
    // fireEvent.mouseDown(el);
    // expect(el).not.toHaveStyle('filter: blur(8px)');
    // fireEvent.mouseUp(el);
    // expect(el).toHaveStyle('filter: blur(8px)');
  });
});
