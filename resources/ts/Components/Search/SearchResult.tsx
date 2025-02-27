import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import {
  Avatar,
  Box,
  Flex,
  IconProps,
  Link,
  ListIcon,
  ListItem,
  VStack,
} from '@chakra-ui/react';
import { AlgoliaHit } from 'instantsearch.js';
import { DonationsIcon } from 'src/Icons/DonationsIcon';

// here we define the icons and urls for different entities we can link to
type SearchResultDisplayModel = {
  icon: (props: IconProps & { hit: AlgoliaHit }) => JSX.Element;
  label: string;
  generateLink: (hit: AlgoliaHit) => string;
  renderMetaData?: (hit: AlgoliaHit) => JSX.Element | null;
};

export const SearchResultDisplayModels: Record<
  string,
  SearchResultDisplayModel
> = {
  default: {
    icon: DonationsIcon,
    label: 'Other',
    generateLink: () => '#',
  },

  user: {
    icon: ({ hit }) => (
      <Avatar
        name={hit.name}
        mr={3}
        size="xs"
        backgroundColor="secondary.600"
        color="white"
      />
    ),
    label: 'Users',
    generateLink: (hit) => '/users/' + hit._id,
    renderMetaData: (hit) => (
      <Flex justifyContent="space-between">
        <Box>{hit.phone_number}</Box>
        <Box>{hit.email}</Box>
      </Flex>
    ),
  },

  donation: {
    icon: DonationsIcon,
    label: 'Donations',
    generateLink: (hit) => '/donations/' + hit._id,
    renderMetaData: (hit) =>
      hit.address ? <Box>{hit.address.replace(/\n/g, ', ')}</Box> : null,
  },
};

interface SearchResultProps {
  hit: AlgoliaHit;
}

const SearchResult = ({ hit }: SearchResultProps) => {
  const model =
    SearchResultDisplayModels[hit._type] || SearchResultDisplayModels.default;
  const href = model.generateLink(hit);
  const metaData = model.renderMetaData?.(hit) ?? '';

  return (
    <ListItem
      borderRadius={'md'}
      _groupHover={{ bgColor: 'gray.700' }}
      _groupFocus={{ bgColor: 'gray.700', outline: 'none' }}
    >
      <Link
        as={InertiaLink}
        href={href}
        data-group
        _hover={{ textDecor: 'none' }}
      >
        <Flex p={3}>
          <ListIcon
            as={model.icon}
            hit={hit}
            _groupHover={{ color: 'secondary.600' }}
            h={5}
            w={5}
            mr={4}
          />
          <VStack alignItems="stretch" spacing="0" flexGrow={1}>
            <Box>{hit.name}</Box>
            <Box color="gray.300">{metaData}</Box>
          </VStack>
        </Flex>
      </Link>
    </ListItem>
  );
};

export default SearchResult;
