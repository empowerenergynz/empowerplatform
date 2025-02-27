import { Tag } from '@chakra-ui/react';
import React from 'react';

export interface DonationStatusTagProps {
  active: boolean;
  dark?: boolean;
}

const DonationStatusTag = ({ active, dark }: DonationStatusTagProps) => {
  return active ? (
    <Tag
      backgroundColor={dark ? 'green.900' : 'green.50'}
      color={'green.500'}
      fontWeight={'700'}
    >
      ACTIVE
    </Tag>
  ) : (
    <Tag
      backgroundColor={dark ? 'orange.900' : 'orange.50'}
      color={'orange.500'}
      fontWeight={'700'}
    >
      PAUSED
    </Tag>
  );
};

export default DonationStatusTag;
