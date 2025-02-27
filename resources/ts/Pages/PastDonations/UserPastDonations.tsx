import React from 'react';
import UserLayout, { UserLayoutProps } from 'src/Layouts/UserLayout';
import { Paginator as PaginatorType } from 'src/Types/Paginator';
import { PastDonation } from 'src/Types/PastDonation';
import PastDonationsTable from 'src/Components/PastDonations/PastDonationsTable';
import { Box, Spacer } from '@chakra-ui/react';
import BorderBox from 'src/Theme/Components/BorderBox';
import Paginator from 'src/Components/List/Paginator';

type UserPastDonationPageProps = UserLayoutProps & {
  pastDonationsPaginator: PaginatorType<PastDonation>;
};

const UserPastDonations = ({
  pastDonationsPaginator,
}: UserPastDonationPageProps) => (
  <Box display="flex" flexDirection="column" flexGrow="1">
    <BorderBox label="DONATION HISTORY">
      <PastDonationsTable pastDonationsPaginator={pastDonationsPaginator} />
    </BorderBox>
    <Spacer />
    <Paginator paginator={pastDonationsPaginator} />
  </Box>
);

UserPastDonations.layout = UserLayout.layout;

export default UserPastDonations;
