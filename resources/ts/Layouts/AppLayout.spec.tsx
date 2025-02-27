/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import AppLayout from 'src/Layouts/AppLayout';
import { Inertia } from '@inertiajs/inertia';
import { Permissions } from 'src/Types/Permission';

let permissions: Permissions[] = [];

jest.mock('@inertiajs/inertia-react', () => ({
  ...jest.requireActual('@inertiajs/inertia-react'),
  usePage: jest.fn(() => ({
    props: {
      currentPage: 'details',
      authUser: {
        name: 'Charles Boyle',
        email: 'charles@example.com',
        permissions,
      },
    },
    url: '/',
  })),
}));

describe('The app layout screen', () => {
  afterAll(() => jest.clearAllMocks());

  it("renders the logged in user's avatar", async () => {
    render(<AppLayout children={null} />);

    expect(screen.queryAllByText('Charles Boyle')).toHaveLength(1);
    expect(screen.queryAllByText('charles@example.com')).toHaveLength(1);
  });

  it('logs out when log out button clicked', async () => {
    render(<AppLayout children={null} />);
    jest.spyOn(Inertia, 'post').mockImplementation(jest.fn());

    await act(() => {
      fireEvent.click(screen.getByTestId('logout'));
    });
    await waitFor(() => expect(Inertia.post).toHaveBeenCalledWith('/logout'));
  });

  it('renders donations menu item if authorised', async () => {
    permissions = [Permissions.VIEW_DONATIONS];

    render(<AppLayout children={null} />);

    expect(screen.queryAllByText('Donations')).toHaveLength(1);
  });

  it("doesn't render donations menu item if authorised", async () => {
    permissions = [];

    render(<AppLayout children={null} />);

    expect(screen.queryAllByText('Donations')).toHaveLength(0);
  });

  it('renders history menu item if not authorised to view own donations - ie is donor', async () => {
    permissions = [Permissions.VIEW_OWN_PAST_DONATIONS];

    render(<AppLayout children={null} />);

    expect(screen.queryAllByText('History')).toHaveLength(1);
  });

  it("doesn't render history menu item if authorised to view own donations", async () => {
    permissions = [];

    render(<AppLayout children={null} />);

    expect(screen.queryAllByText('History')).toHaveLength(0);
  });

  it('renders Create Credit menu item if authorised to create Credits - ie is agency user', async () => {
    permissions = [Permissions.CREATE_CREDITS];

    render(<AppLayout children={null} />);

    expect(screen.queryAllByText('New Client Allocation')).toHaveLength(1);
  });

  it("doesn't render Create Credit menu item if not authorised to create Credits", async () => {
    permissions = [];

    render(<AppLayout children={null} />);

    expect(screen.queryAllByText('New Client Allocation')).toHaveLength(0);
  });

  it('renders Bill Credits menu item if authorised to view all Credits - ie is Empower admin', async () => {
    permissions = [Permissions.VIEW_ALL_CREDITS];

    render(<AppLayout children={null} />);

    expect(screen.queryAllByText('Bill Credits')).toHaveLength(1);
  });

  it("doesn't render Bill Credits menu item if not authorised to view all Credits", async () => {
    permissions = [];

    render(<AppLayout children={null} />);

    expect(screen.queryAllByText('Bill Credits')).toHaveLength(0);
  });
});
