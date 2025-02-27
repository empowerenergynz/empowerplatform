import { Link, ListItem } from '@chakra-ui/react';
import { InertiaLink } from '@inertiajs/inertia-react';
import React from 'react';

interface NavItemProps {
  href: string;
  label: string;
  isCurrent: boolean;
}

const NavItem = (props: NavItemProps) => {
  const { href, label, isCurrent, ...otherProps } = props;
  const style = isCurrent
    ? {
        borderBottom: '4px solid',
        borderColor: 'primary.600',
        color: 'gray.600',
      }
    : {
        borderBottom: '4px solid transparent',
      };

  // put the padding around the Link instead of the ListItem
  // so the click target is the full tab not just the text

  return (
    <ListItem>
      <Link
        as={InertiaLink}
        color={isCurrent ? 'gray.600' : 'gray.500'}
        fontSize={'md'}
        href={href}
        aria-current={isCurrent ? 'page' : 'false'}
        only={['flash', 'tabData']}
        px={4}
        py={2}
        display="inline-block"
        _hover={{ textDecoration: 'none' }}
        {...otherProps}
        {...style}
      >
        {label}
      </Link>
    </ListItem>
  );
};

export default NavItem;
