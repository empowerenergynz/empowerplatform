import {
  IconProps,
  ListIcon,
  ListItem,
  ListItemProps,
  Text,
} from '@chakra-ui/react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import useIsChildOfCurrentUrl from 'src/Hooks/useIsChildOfCurrentUrl';
import { Page } from '@inertiajs/inertia';
import { AppSharedProps } from 'src/Types/AppSharedProps';

interface MenuItemProps extends ListItemProps {
  label: string;
  to: string;
  icon?: (props: IconProps) => JSX.Element;
  nochildren?: boolean;
}

export const MenuItem = ({
  label,
  to,
  icon,
  nochildren,
  ...listItemProps
}: MenuItemProps) => {
  const defaultActiveStyle = { backgroundColor: 'primary.700', color: 'white' };
  const { url } = usePage<Page<AppSharedProps>>();

  const isChild = useIsChildOfCurrentUrl(to);
  // Only consider URL up to query string (?...)
  const urlPath =
    url.indexOf('?') === -1 ? url : url.substring(0, url.indexOf('?'));
  const isCurrent = nochildren ? urlPath === to : isChild;
  return (
    <ListItem
      as={InertiaLink}
      href={to}
      display="flex"
      justifyContent="start"
      alignItems="center"
      color="gray.900"
      p={3}
      h={12}
      aria-current={isCurrent ? 'page' : 'false'}
      _activeLink={defaultActiveStyle}
      _hover={defaultActiveStyle}
      borderRadius="md"
      {...listItemProps}
    >
      {icon && <ListIcon as={icon} boxSize={6} />}
      <Text fontWeight="700" ml="3" noOfLines={1}>
        {label}
      </Text>
    </ListItem>
  );
};
