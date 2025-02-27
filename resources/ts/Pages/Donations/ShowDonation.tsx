import React, { ReactElement } from 'react';
import { Box, Container, HStack, Link, VStack } from '@chakra-ui/react';
import AppLayout from 'src/Layouts/AppLayout';
import { Donation } from 'src/Types/Donation';
import { Permissions } from 'src/Types/Permission';
import usePermissions from 'src/Hooks/usePermissions';
import {
  getMapLinkFromAddress,
  getMapLinkFromCoordinates,
} from 'src/Formatter/GoogleMapLinkFormatter';
import BackButton from 'src/Components/Common/BackButton';
import InertiaButtonLink from 'src/Theme/Components/InertiaButtonLink';
import BorderBox from 'src/Theme/Components/BorderBox';
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionListItem,
  DescriptionTerm,
} from 'src/Theme/Components/DescriptionList';
import DonationStatusTag from 'src/Components/Donations/DonationStatusTag';

interface ShowDonationPageProps {
  donation: Donation;
}

const ShowDonation = ({ donation }: ShowDonationPageProps) => {
  const [canEditDonations, canViewUsers] = usePermissions([
    Permissions.EDIT_DONATIONS,
    Permissions.VIEW_USERS,
  ]);
  const editButton = canEditDonations && (
    <InertiaButtonLink href={`/donations/${donation.id}/edit`} variant="link">
      Edit
    </InertiaButtonLink>
  );

  return (
    <VStack alignItems="stretch" spacing={6} w="full">
      <HStack>
        <BackButton href="/donations" label="Back to donations list" />
        <Box as="h1" mb={0} textStyle="h1">
          {donation.icp}
        </Box>
      </HStack>

      <BorderBox label="DONATION DETAILS" action={editButton}>
        <Container alignSelf="center" p={0}>
          <DescriptionList mb={4}>
            {canViewUsers && (
              <DescriptionListItem>
                <DescriptionTerm>Donor</DescriptionTerm>
                <DescriptionDetails>
                  <InertiaButtonLink
                    fontSize="normal"
                    fontWeight="normal"
                    variant="link"
                    color="teal.500"
                    href={`/users/${donation.user_id}`}
                    data-testid="customer-link"
                  >
                    {donation.user?.name}
                  </InertiaButtonLink>
                </DescriptionDetails>
              </DescriptionListItem>
            )}
            <DescriptionListItem>
              <DescriptionTerm>ICP</DescriptionTerm>
              <DescriptionDetails>{donation.icp}</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Retailer</DescriptionTerm>
              <DescriptionDetails>{donation.retailer}</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Account Number</DescriptionTerm>
              <DescriptionDetails>{donation.account_number}</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Address</DescriptionTerm>
              <DescriptionDetails>
                {donation.address && (
                  <Link
                    fontSize="normal"
                    color="teal.500"
                    href={getMapLinkFromAddress(donation.address)}
                    isExternal
                  >
                    {donation.address}
                  </Link>
                )}
              </DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>GPS Coordinates</DescriptionTerm>
              <DescriptionDetails>
                {donation.gps_coordinates && (
                  <Link
                    fontSize="normal"
                    color="teal.500"
                    href={getMapLinkFromCoordinates(donation.gps_coordinates)}
                    isExternal
                  >
                    {donation.gps_coordinates}
                  </Link>
                )}
              </DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Amount</DescriptionTerm>
              <DescriptionDetails>
                {donation.is_dollar
                  ? '$' + donation.amount
                  : parseFloat(donation.amount) + '%'}
              </DescriptionDetails>
            </DescriptionListItem>
            {!donation.is_dollar && (
              <DescriptionListItem>
                <DescriptionTerm>Buy-Back Rate</DescriptionTerm>
                <DescriptionDetails>
                  ${donation.buyback_rate}
                </DescriptionDetails>
              </DescriptionListItem>
            )}
            <DescriptionListItem>
              <DescriptionTerm>Status</DescriptionTerm>
              <DescriptionDetails>
                <DonationStatusTag active={donation.is_active} />
              </DescriptionDetails>
            </DescriptionListItem>
            {canViewUsers && (
              <DescriptionListItem>
                <DescriptionTerm>Donation ID</DescriptionTerm>
                <DescriptionDetails data-testid="donation-id">
                  {donation.id}
                </DescriptionDetails>
              </DescriptionListItem>
            )}
          </DescriptionList>
        </Container>
      </BorderBox>
    </VStack>
  );
};

ShowDonation.layout = (page: ReactElement) => (
  <AppLayout children={page} dataTestid="show-donation-page" />
);

export default ShowDonation;
