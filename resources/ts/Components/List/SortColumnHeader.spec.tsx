import React from 'react';
import { render, screen } from '@testing-library/react';
import SortColumnHeader from 'src/Components/List/SortColumnHeader';
import { SortDirection } from 'src/Types/SortDirection';
import userEvent from '@testing-library/user-event';

describe('The Sort Column Header Component', () => {
  it('should update the sort direction and display a button for the opposite sort direction', async () => {
    const onClick = jest.fn();
    const sortConfig = {
      key: 'name',
      direction: SortDirection.DESC,
    };

    render(
      <SortColumnHeader
        label={'Name'}
        column={'name'}
        onClick={onClick}
        sortConfig={sortConfig}
      />
    );

    const sortByNameDescButton = screen.queryByTestId('sort-name-desc');
    expect(sortByNameDescButton).toBeNull();

    await userEvent.click(screen.getByTestId('sort-name-asc'));
    expect(onClick).toHaveBeenCalledWith('name', SortDirection.ASC);
  });
});
