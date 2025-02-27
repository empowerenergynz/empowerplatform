import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { Inertia } from '@inertiajs/inertia';
import { LeftIcon } from 'src/Icons/LeftIcon';

interface BackButtonProps {
  href: string;
  label: string;
}

const BackButton = ({ href, label }: BackButtonProps) => (
  <IconButton
    as={'a'}
    colorScheme="primary"
    variant="solidPrimary"
    aria-label={label}
    icon={<LeftIcon stroke="gray.50" />}
    onClick={() => Inertia.visit(href)}
    cursor={'pointer'}
  />
);

export default BackButton;
