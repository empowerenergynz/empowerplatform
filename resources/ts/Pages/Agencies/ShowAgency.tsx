import React, { ReactElement } from 'react';
import { Box, Container, Flex, HStack } from '@chakra-ui/react';
import usePermissions from 'src/Hooks/usePermissions';
import { Permissions } from 'src/Types/Permission';
import BorderBox from 'src/Theme/Components/BorderBox';
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionListItem,
  DescriptionTerm,
} from 'src/Theme/Components/DescriptionList';
import InertiaButtonLink from 'src/Theme/Components/InertiaButtonLink';
import { Agency } from 'src/Types/Agency';
import AppLayout from 'src/Layouts/AppLayout';
import BackButton from '../../Components/Common/BackButton';
import { formatCurrency, formatDateTime } from 'src/lib';

type ShowAgencyPageProps = {
  agency: Agency;
  liveBalance: number;
};

const ShowAgency = ({ agency, liveBalance }: ShowAgencyPageProps) => {
  const [canEditAgency] = usePermissions([Permissions.EDIT_AGENCIES]);

  const editButton = canEditAgency && (
    <InertiaButtonLink href={`/agencies/${agency.id}/edit`} variant="link">
      Edit
    </InertiaButtonLink>
  );

  return (
    <Flex flexDirection="column" alignItems="stretch" w="full" flexGrow="1">
      <HStack alignItems="center" mb={6}>
        <BackButton href="/agencies" label="Back to agencies list" />
        <Box as="h1" mb={0} textStyle="h1">
          {agency.name}
          {agency.deleted_at ? ' (Archived)' : ''}
        </Box>
      </HStack>
      <BorderBox label="AGENCY DETAILS" action={editButton}>
        <Container alignSelf="center">
          <DescriptionList mb={4}>
            <DescriptionListItem>
              <DescriptionTerm>Name</DescriptionTerm>
              <DescriptionDetails>{agency.name}</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Balance Datum</DescriptionTerm>
              <DescriptionDetails>
                {formatCurrency(agency.balance)}
                <Box as="small" marginLeft={4}>
                  (as at {formatDateTime(agency.balance_date)})
                </Box>
              </DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Calculated "Live" Balance</DescriptionTerm>
              <DescriptionDetails>
                {formatCurrency(liveBalance)}
              </DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Region</DescriptionTerm>
              <DescriptionDetails>
                {agency.region?.name || '(Nationwide)'}
              </DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>District</DescriptionTerm>
              <DescriptionDetails>{agency.district?.name}</DescriptionDetails>
            </DescriptionListItem>
          </DescriptionList>
        </Container>
      </BorderBox>
    </Flex>
  );
};

ShowAgency.layout = (page: ReactElement) => <AppLayout children={page} />;

export default ShowAgency;
