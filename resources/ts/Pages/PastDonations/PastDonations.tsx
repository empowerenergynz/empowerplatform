import AppLayout from 'src/Layouts/AppLayout';
import { Box, Spacer } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { Paginator as PaginatorType } from 'src/Types/Paginator';
import PastDonationsTable from 'src/Components/PastDonations/PastDonationsTable';
import { PastDonation } from 'src/Types/PastDonation';
import Paginator from 'src/Components/List/Paginator';

interface PastDonationsPageProps {
  pastDonationsPaginator: PaginatorType<PastDonation>;
}

const PastDonations = ({ pastDonationsPaginator }: PastDonationsPageProps) => {
  return (
    <Box display="flex" flexDirection="column" flexGrow="1">
      <Box as="h1" data-testid="page-title" textStyle="pageTitle" mb={6}>
        History
      </Box>
      <PastDonationsTable pastDonationsPaginator={pastDonationsPaginator} />
      <Spacer />
      <Paginator paginator={pastDonationsPaginator} />
    </Box>
  );
};

PastDonations.layout = (page: ReactElement) => <AppLayout children={page} />;

export default PastDonations;
