import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { InertiaLink } from '@inertiajs/inertia-react';
import useLocation from 'src/Hooks/useLocation';

interface LinkSortColumnHeaderProps {
  label: string;
  column: string;
  dataKey: string;
}

const LinkSortColumnHeader = ({
  label,
  column,
  dataKey,
}: LinkSortColumnHeaderProps) => {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const activeSort = urlSearchParams.get('sort');

  // we are using laravel-query-builder to sort, urls expected are /path?sort=column for ASC or  /path?sort=-column for DESC
  const columnIsSorted =
    activeSort === column || activeSort?.substring(1) === column;
  const nextSort = activeSort === column ? `-${column}` : column;

  // build href by updating sort and deleting page number
  urlSearchParams.delete('page');
  urlSearchParams.set('sort', nextSort);
  const href = `${location.pathname}?${urlSearchParams.toString()}`;

  return (
    <Box my="auto">
      {columnIsSorted ? (
        <Button
          as={InertiaLink}
          href={href}
          preserveScroll
          preserveState
          only={[dataKey, 'flash']}
          variant="solid"
          backgroundColor="body.300"
          px={2}
          rightIcon={
            nextSort[0] === '-' ? (
              <ArrowDownIcon color="secondary.600" />
            ) : (
              <ArrowUpIcon color="secondary.600" />
            )
          }
          data-testid={`sort-${column}`}
        >
          {label}
        </Button>
      ) : (
        <Button
          as={InertiaLink}
          href={href}
          preserveScroll
          preserveState
          only={[dataKey, 'flash']}
          variant="ghost"
          px={2}
          data-testid={`sort-${column}`}
        >
          {label}
        </Button>
      )}
    </Box>
  );
};

export default LinkSortColumnHeader;
