import React, { ReactElement, useState } from 'react';
import BorderBox from 'src/Theme/Components/BorderBox';
import AppLayout from 'src/Layouts/AppLayout';
import { formatCurrency } from 'src/lib';
import { Flex, Box, Button } from '@chakra-ui/react';

type ShowAgencyBalancePageProps = {
  liveBalance: number;
};

const ShowAgencyBalance = ({ liveBalance }: ShowAgencyBalancePageProps) => {
  const [show, setShow] = useState(false);

  return (
    <BorderBox label="Balance">
      <Flex direction="column" alignItems="center" gap="50px">
        <Box textStyle="h3">Current Donation Pool:</Box>
        <Box
          textStyle="h1"
          color="primary.500"
          transition="filter 0.2s"
          filter={show ? undefined : 'blur(8px)'}
          // add padding to make sure the blur isn't cropped (iOS?)
          padding="16px"
        >
          {formatCurrency(liveBalance)}
        </Box>
        <Button
          variant="solidPrimary"
          // desktop events
          onMouseDown={() => setShow(true)}
          onMouseUp={() => setShow(false)}
          onMouseLeave={() => setShow(false)}
          // mobile events
          onTouchStart={() => setShow(true)}
          onTouchEnd={() => setShow(false)}
        >
          Press and hold to show balance
        </Button>
      </Flex>
    </BorderBox>
  );
};

ShowAgencyBalance.layout = (page: ReactElement) => (
  <AppLayout children={page} />
);

export default ShowAgencyBalance;
