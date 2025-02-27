import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { SortDirection } from 'src/Types/SortDirection';
import { SortConfiguration } from 'src/Hooks/useSortableCollection';

interface SortableHeaderProps<T> {
  label: string;
  column: keyof T;
  onClick: (property: keyof T, direction: SortDirection) => void;
  sortConfig: SortConfiguration<T>;
}

const SortColumnHeader = <T,>({
  label,
  column,
  onClick,
  sortConfig,
}: SortableHeaderProps<T>) => {
  const columnIsSorted = sortConfig.key === column;
  const nextSort =
    columnIsSorted && sortConfig.direction === SortDirection.ASC
      ? SortDirection.DESC
      : SortDirection.ASC;

  return (
    <Box my="auto">
      {columnIsSorted ? (
        <Button
          onClick={() => onClick(column, nextSort)}
          variant="solid"
          backgroundColor="body.300"
          px={2}
          rightIcon={
            nextSort === SortDirection.DESC ? (
              <ArrowDownIcon color={'secondary.600'} />
            ) : (
              <ArrowUpIcon color={'secondary.600'} />
            )
          }
          data-testid={`sort-${String(column)}-${nextSort}`}
        >
          {label}
        </Button>
      ) : (
        <Button
          onClick={() => onClick(column, nextSort)}
          variant="ghost"
          px={2}
          data-testid={`sort-${String(column)}-${nextSort}`}
        >
          {label}
        </Button>
      )}
    </Box>
  );
};

export default SortColumnHeader;
