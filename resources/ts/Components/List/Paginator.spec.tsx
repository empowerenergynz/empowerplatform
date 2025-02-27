import React from 'react';
import { render, screen } from '@testing-library/react';
import Paginator from 'src/Components/List/Paginator';

describe('The Paginator Component', () => {
  it('should disable previous and next links when paginator contains only a page', function () {
    const paginator = {
      current_page: 1,
      data: [
        {
          id: 61,
          name: 'Big black car',
          attributes: {
            color: 'black',
            licence_plate: 'IYS649',
          },
          asset_type_id: 2,
          created_at: '2022-03-07T22:20:13.000000Z',
          updated_at: '2022-03-07T22:20:13.000000Z',
        },
      ],
      first_page_url: 'https://empower.local/assets/machinery?page=1',
      from: 1,
      last_page: 1,
      last_page_url: 'https://empower.local/assets/machinery?page=1',
      links: [
        {
          url: null,
          label: 'Previous',
          active: false,
        },
        {
          url: 'https://empower.local/assets/machinery?page=1',
          label: '1',
          active: true,
        },
        {
          url: null,
          label: 'Next',
          active: false,
        },
      ],
      next_page_url: null,
      path: 'https://empower.local/assets/machinery',
      per_page: 1,
      prev_page_url: null,
      to: 1,
      total: 1,
    };
    render(<Paginator paginator={paginator} />);

    expect(screen.getByLabelText('Previous')).toBeDisabled();
    expect(screen.getByLabelText('Next')).toBeDisabled();
  });

  it('should disable previous link when visiting the first page', function () {
    const paginator = {
      current_page: 1,
      data: [
        {
          id: 61,
          name: 'Big black car',
          attributes: {
            color: 'black',
            licence_plate: 'IYS649',
          },
          asset_type_id: 2,
          created_at: '2022-03-07T22:20:13.000000Z',
          updated_at: '2022-03-07T22:20:13.000000Z',
        },
      ],
      first_page_url: 'https://empower.local/assets/machinery?page=1',
      from: 1,
      last_page: 2,
      last_page_url: 'https://empower.local/assets/machinery?page=2',
      links: [
        {
          url: null,
          label: 'Previous',
          active: false,
        },
        {
          url: 'https://empower.local/assets/machinery?page=1',
          label: '1',
          active: true,
        },
        {
          url: 'https://empower.local/assets/machinery?page=2',
          label: '2',
          active: false,
        },
        {
          url: 'https://empower.local/assets/machinery?page=2',
          label: 'Next',
          active: false,
        },
      ],
      next_page_url: 'https://empower.local/assets/machinery?page=2',
      path: 'https://empower.local/assets/machinery',
      per_page: 1,
      prev_page_url: null,
      to: 1,
      total: 2,
    };

    render(<Paginator paginator={paginator} />);

    expect(screen.getByLabelText('Previous')).toBeDisabled();
    expect(screen.getByLabelText('Next')).toBeEnabled();
  });

  it('should display all links', function () {
    const paginator = {
      current_page: 2,
      data: [
        {
          id: 5,
          name: 'Little maroon tractor',
          attributes: {
            color: 'maroon',
            licence_plate: 'JOR228',
          },
          asset_type_id: 2,
          created_at: '2022-03-08T02:21:47.000000Z',
          updated_at: '2022-03-08T02:21:47.000000Z',
          reference: 'okzk',
        },
      ],
      first_page_url: 'https://empower.local/assets/machinery?page=1',
      from: 2,
      last_page: 3,
      last_page_url: 'https://empower.local/assets/machinery?page=3',
      links: [
        {
          url: 'https://empower.local/assets/machinery?page=1',
          label: 'Previous',
          active: false,
        },
        {
          url: 'https://empower.local/assets/machinery?page=1',
          label: '1',
          active: false,
        },
        {
          url: 'https://empower.local/assets/machinery?page=2',
          label: '2',
          active: true,
        },
        {
          url: 'https://empower.local/assets/machinery?page=3',
          label: '3',
          active: false,
        },
        {
          url: 'https://empower.local/assets/machinery?page=3',
          label: 'Next',
          active: false,
        },
      ],
      next_page_url: 'https://empower.local/assets/machinery?page=3',
      path: 'https://empower.local/assets/machinery',
      per_page: 1,
      prev_page_url: 'https://empower.local/assets/machinery?page=1',
      to: 2,
      total: 3,
    };

    render(<Paginator paginator={paginator} />);

    expect(screen.getByLabelText('Previous')).toBeVisible();
    expect(screen.getByLabelText('1')).toBeVisible();
    expect(screen.getByRole('link', { current: true })).toHaveTextContent('2');
    expect(screen.getByLabelText('3')).toBeVisible();
    expect(screen.getByLabelText('Next')).toBeVisible();
  });
});
