import { Select, SelectProps } from '@chakra-ui/react';
import React from 'react';

const SelectFilter = ({ children, ...rest }: SelectProps) => {
  return (
    <Select
      objectPosition="right"
      iconColor={'gray.700'}
      w={'fit-content'}
      color={'gray.700'}
      fontWeight={600}
      {...rest}
    >
      {children}
    </Select>
  );
};

export default SelectFilter;
