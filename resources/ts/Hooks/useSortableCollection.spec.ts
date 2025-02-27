import useSortableCollection from 'src/Hooks/useSortableCollection';
import { SortDirection } from 'src/Types/SortDirection';
import { orderBy } from 'lodash';
import { UserFactory } from 'src/Types/User';
import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';

describe('The SortableCollection hook', () => {
  it('can sort a collection', () => {
    const users = UserFactory.buildList(4);

    const usersOrderedByNameDesc = orderBy(users, ['name'], ['desc']);
    const descendingNames = usersOrderedByNameDesc.map((sensor) => sensor.name);

    const { result } = renderHook(() =>
      useSortableCollection(users, {
        direction: SortDirection.DESC,
        key: 'name',
      })
    );
    const namesSortedFromHook = result.current.items.map((item) => item.name);

    expect(namesSortedFromHook).toEqual(descendingNames);
  });

  it('updates the sort configuration when sorting on a different key', () => {
    const users = UserFactory.buildList(4);

    const { result } = renderHook(() =>
      useSortableCollection(users, {
        key: 'name',
        direction: SortDirection.DESC,
      })
    );

    act(() => {
      result.current.setSortState('email');
    });

    expect(result.current.sortConfig.direction).toEqual(SortDirection.ASC);
    expect(result.current.sortConfig.key).toEqual('email');
  });

  it('updates the sort direction when sorting on the same key', () => {
    const users = UserFactory.buildList(4);

    const { result } = renderHook(() =>
      useSortableCollection(users, {
        key: 'name',
        direction: SortDirection.ASC,
      })
    );

    act(() => {
      result.current.setSortState('name');
    });

    expect(result.current.sortConfig.direction).toEqual(SortDirection.DESC);
  });
});
