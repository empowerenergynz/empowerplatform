import React from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

const Loading = () => (
  <Flex minH="100vh" justifyContent="center" alignItems="center">
    <Spinner size="xl" />
  </Flex>
);

export default Loading;
