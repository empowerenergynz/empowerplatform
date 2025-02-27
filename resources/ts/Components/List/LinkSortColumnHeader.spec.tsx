import React from 'react';
import useLocation from 'src/Hooks/useLocation';
import { render, screen } from '@testing-library/react';
import LinkSortColumnHeader from 'src/Components/List/LinkSortColumnHeader';

jest.mock('src/Hooks/useLocation');

describe('The Link Sort Column Header Component', () => {
  it('should create a link with asc direction when currently sorting on desc direction', function () {
    const mockUseLocation = useLocation as jest.Mock;
    mockUseLocation.mockReturnValue({
      pathname: '/assets/machinery',
      search: '?sort=-name',
    });

    render(
      <LinkSortColumnHeader label={'Name'} column={'name'} dataKey={'test'} />
    );

    expect(screen.getByRole('link')).toHaveTextContent('Name');
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/assets/machinery?sort=name'
    );
  });

  it('should create a link with desc direction when currently sorting on asc direction', function () {
    const mockUseLocation = useLocation as jest.Mock;
    mockUseLocation.mockReturnValue({
      pathname: '/assets/machinery',
      search: '?sort=name',
    });

    render(
      <LinkSortColumnHeader label={'Name'} column={'name'} dataKey={'test'} />
    );

    expect(screen.getByRole('link')).toHaveTextContent('Name');
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/assets/machinery?sort=-name'
    );
  });

  it('should create a link with asc sort when sorting on other column', function () {
    const mockUseLocation = useLocation as jest.Mock;
    mockUseLocation.mockReturnValue({
      pathname: '/assets/machinery',
      search: '?sort=foo',
    });

    render(
      <LinkSortColumnHeader label={'Name'} column={'name'} dataKey={'test'} />
    );

    expect(screen.getByRole('link')).toHaveTextContent('Name');
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/assets/machinery?sort=name'
    );
  });

  it('should maintain filters when creating sorting links', function () {
    const mockUseLocation = useLocation as jest.Mock;
    mockUseLocation.mockReturnValue({
      pathname: '/assets/machinery',
      search: '?filter[status]=available',
    });

    render(
      <LinkSortColumnHeader label={'Name'} column={'name'} dataKey={'test'} />
    );

    expect(screen.getByRole('link')).toHaveTextContent('Name');
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/assets/machinery?filter%5Bstatus%5D=available&sort=name'
    );
  });
});
