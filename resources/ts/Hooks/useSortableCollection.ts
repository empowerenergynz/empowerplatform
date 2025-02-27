import { SortDirection } from 'src/Types/SortDirection';
import { useState } from 'react';
import { orderBy } from 'lodash';

export interface SortConfiguration<T> {
  key: keyof T;
  direction: SortDirection;
}

const useSortableCollection = <T>(
  initialSort: T[],
  config: SortConfiguration<T>
) => {
  const [currentSort, setCurrentSort] = useState(config);

  const sortedCollection = () => {
    return orderBy(initialSort, currentSort.key, currentSort.direction);
  };

  const setSortState = (key: keyof T) => {
    let direction = SortDirection.ASC;
    if (
      currentSort.key === key &&
      currentSort.direction === SortDirection.ASC
    ) {
      direction = SortDirection.DESC;
    }

    setCurrentSort({ key, direction });
  };

  return { items: sortedCollection(), sortConfig: currentSort, setSortState };
};

export default useSortableCollection;
