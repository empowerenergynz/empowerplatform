import React from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { Paginator as PaginatorType } from 'src/Types/Paginator';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { InertiaLink } from '@inertiajs/inertia-react';

interface PaginationProps<T> {
  paginator: PaginatorType<T>;
}

const Paginator = <T,>({ paginator }: PaginationProps<T>) => {
  return (
    <Flex
      data-testid={'paginator'}
      as={'nav'}
      aria-label="Pagination navigation"
      flexDirection={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      mt={5}
    >
      <Flex gap={1}>
        {paginator.links.map((link, index) => (
          <Button
            as={link.url ? InertiaLink : undefined}
            href={link.url || ''}
            aria-current={link.active}
            aria-label={link.label}
            variant={link.active ? 'solidPrimary' : 'link'}
            isDisabled={!link.url}
            key={index}
            size="xs"
          >
            {index === 0 ? (
              <ChevronLeftIcon />
            ) : index === paginator.links.length - 1 ? (
              <ChevronRightIcon />
            ) : (
              link.label
            )}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};

export default Paginator;
