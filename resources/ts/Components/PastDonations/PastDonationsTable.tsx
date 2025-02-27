import { Box, Flex, Grid } from '@chakra-ui/react';
import React from 'react';
import { Paginator as PaginatorType } from 'src/Types/Paginator';
import DataTableHeaderRow from 'src/Components/Common/DataTableHeaderRow';
import LinkSortColumnHeader from 'src/Components/List/LinkSortColumnHeader';
import { PastDonation } from 'src/Types/PastDonation';

export type PastDonationsTableProps = {
  pastDonationsPaginator: PaginatorType<PastDonation>;
};

const PastDonationsTable = ({
  pastDonationsPaginator,
}: PastDonationsTableProps) => {
  return (
    <Box>
      <DataTableHeaderRow templateColumns="repeat(5, 1fr)">
        <Box pl={3} my="auto">
          ICP
        </Box>
        <LinkSortColumnHeader
          label="Donation Date"
          column="date"
          dataKey="pastDonationsPaginator"
        />
        <Box pl={2} my="auto">
          Donation Amount
        </Box>
        <Box pl={2} my="auto">
          Retailer
        </Box>
        <Box pl={2} my="auto">
          Account Number
        </Box>
      </DataTableHeaderRow>
      {pastDonationsPaginator.data.length > 0 ? (
        <Flex flexDirection="column" data-testid="donations-list">
          {pastDonationsPaginator.data.map((pastDonation) => (
            <Grid
              key={pastDonation.id}
              templateColumns="repeat(5, 1fr)"
              borderRadius="md"
              borderWidth="1px"
              py={5}
              px={3}
              mt={2}
            >
              <Box pl={2}>{pastDonation.icp}</Box>
              <Box pl={3}>
                {pastDonation.date.split('-').reverse().join('/')}
              </Box>
              <Box pl={3} data-testid="donor-amount">
                ${pastDonation.amount}
              </Box>
              <Box pl={3}>
                {pastDonation.retailer || pastDonation.donation?.retailer || ''}
              </Box>
              <Box pl={3}>{pastDonation.account_number}</Box>
            </Grid>
          ))}
        </Flex>
      ) : (
        <Box
          my="auto"
          borderRadius="md"
          borderWidth="1px"
          textAlign="center"
          p={4}
          mt={2}
        >
          No Past Donations
        </Box>
      )}
    </Box>
  );
};

export default PastDonationsTable;
