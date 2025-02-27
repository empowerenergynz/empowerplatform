import { Donation } from 'src/Types/Donation';
import AppLayout from 'src/Layouts/AppLayout';
import { Box, Button, Flex, Grid, Spacer } from '@chakra-ui/react';
import React, { ReactElement, useMemo, useState } from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { Permissions } from 'src/Types/Permission';
import { Paginator as PaginatorType } from 'src/Types/Paginator';
import usePermissions from 'src/Hooks/usePermissions';
import DataTableHeaderRow from 'src/Components/Common/DataTableHeaderRow';
import LinkSortColumnHeader from 'src/Components/List/LinkSortColumnHeader';
import Paginator from 'src/Components/List/Paginator';
import { Page } from '@inertiajs/inertia';
import { AppSharedProps } from 'src/Types/AppSharedProps';
import DonationStatusTag from 'src/Components/Donations/DonationStatusTag';
import InertiaButtonLink from 'src/Theme/Components/InertiaButtonLink';
import CreatePastDonationModal from 'src/Pages/PastDonations/CreatePastDonationModal';

interface DonationsPageProps {
  donationsPaginator: PaginatorType<Donation>;
}

const Donations = ({ donationsPaginator }: DonationsPageProps) => {
  const {
    props: { authUser },
  } = usePage<Page<AppSharedProps>>();

  const [
    canExportDonations,
    canCreateDonations,
    canViewUsers,
    canCreatePastDonations,
  ] = usePermissions([
    Permissions.EXPORT_DONATIONS,
    Permissions.CREATE_DONATIONS,
    Permissions.VIEW_USERS,
    Permissions.CREATE_PAST_DONATIONS,
  ]);

  // make the "Record Donation" button column a fixed width
  const templateColumns = useMemo<string>(
    // admins see the donor name, but donors see the ICP number, so repeat column numbers are the same
    () => `repeat(6, 1fr) ${canCreatePastDonations ? '140px' : ''}`,
    [canCreatePastDonations]
  );

  const [createHistoryForDonation, setCreateHistoryForDonation] =
    useState<Donation | null>(null);

  return (
    <>
      <Box
        as="h2"
        data-testid="welcome"
        color="primary.700"
        textStyle="h2"
        mb="34px"
      >
        Welcome {authUser.first_name}!
      </Box>
      <Flex mt={2} mb={6} justifyContent="space-between">
        <Box as="h1" data-testid="page-title" textStyle="pageTitle" mb="10px">
          Donations
        </Box>
        <Box>
          {canExportDonations && (
            <Button
              as="a"
              variant="solidPrimary"
              href="/donations/export"
              target="_blank"
            >
              Export Donations
            </Button>
          )}
          {canCreateDonations && (
            <InertiaButtonLink
              alignSelf="flex-end"
              href="/donations/create"
              variant="solidPrimary"
              ml="12px"
            >
              Add Donation
            </InertiaButtonLink>
          )}
        </Box>
      </Flex>
      <DataTableHeaderRow templateColumns={templateColumns}>
        {canViewUsers ? (
          <LinkSortColumnHeader
            label="Donor Name"
            column="donor"
            dataKey="donationsPaginator"
          />
        ) : (
          <Box pl={3} my="auto">
            ICP
          </Box>
        )}
        <Box pl={3} my="auto">
          Retailer
        </Box>
        <Box pl={2} my="auto">
          Account Number
        </Box>
        <LinkSortColumnHeader
          label="Donation Amount"
          column="amount"
          dataKey="donationsPaginator"
        />
        <Box pl={1} my="auto">
          Buy-Back Rate
        </Box>
        <Box pl={1} my="auto">
          Status
        </Box>
        {canCreatePastDonations && <Box pl={2} my="auto"></Box>}
      </DataTableHeaderRow>
      {donationsPaginator.data.length > 0 ? (
        <Flex flexDirection="column" data-testid="donations-list" flexGrow={1}>
          {donationsPaginator.data.map((donation) => (
            <Grid
              as={InertiaLink}
              href={`/donations/${donation.id}`}
              key={donation.id}
              templateColumns={templateColumns}
              borderRadius="md"
              borderWidth="1px"
              alignItems="center"
              py={5}
              px={3}
              mt={2}
            >
              {canViewUsers ? (
                <Box data-testid="donor-name">{donation.user?.name || ''}</Box>
              ) : (
                <Box>{donation.icp}</Box>
              )}
              <Box pl={2}>{donation.retailer}</Box>
              <Box pl={2}>{donation.account_number}</Box>
              <Box pl={2} data-testid="donor-amount">
                {donation.is_dollar
                  ? '$' + donation.amount
                  : parseFloat(donation.amount) + '%'}
              </Box>
              <Box pl={2} data-testid="buyback-rate">
                {donation.is_dollar ? '-' : '$' + donation.buyback_rate}
              </Box>
              <Box pl={2}>
                <DonationStatusTag active={donation.is_active} />
              </Box>
              {canCreatePastDonations && (
                <Box pl={2} w="140px">
                  <Button
                    variant="solidPrimary"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setCreateHistoryForDonation(donation);
                    }}
                  >
                    Record Donation
                  </Button>
                </Box>
              )}
            </Grid>
          ))}
          <Spacer />
          <Paginator paginator={donationsPaginator} />
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
          No Donations
        </Box>
      )}
      {createHistoryForDonation && (
        <CreatePastDonationModal
          donation={createHistoryForDonation}
          onClose={() => setCreateHistoryForDonation(null)}
        />
      )}
    </>
  );
};

Donations.layout = (page: ReactElement) => <AppLayout children={page} />;

export default Donations;
