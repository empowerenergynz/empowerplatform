import React, { ReactElement } from 'react';
import { Box, Flex, Grid, Input, Skeleton, Spacer } from '@chakra-ui/react';
import AppLayout from 'src/Layouts/AppLayout';
import { Permissions } from 'src/Types/Permission';
import usePermissions from 'src/Hooks/usePermissions';
import LinkSortColumnHeader from 'src/Components/List/LinkSortColumnHeader';
import DataTableHeaderRow from 'src/Components/Common/DataTableHeaderRow';
import Paginator from 'src/Components/List/Paginator';
import { Paginator as PaginatorType } from 'src/Types/Paginator';
import { Inertia } from '@inertiajs/inertia';
import InertiaButtonLink from 'src/Theme/Components/InertiaButtonLink';
import { Agency } from 'src/Types/Agency';
import useAgenciesQuery from 'src/Hooks/Queries/useAgenciesQuery';
import { formatCurrency } from 'src/lib';

interface AgenciesPageProps {
  agenciesPaginator: PaginatorType<Agency>;
  filter?: {
    search: string;
  };
}

// columns are name, balance, region, district
const templateColumns = '1fr 150px 1fr 1fr';

const Agencies = ({ agenciesPaginator, filter }: AgenciesPageProps) => {
  const { search, setSearch, processing } = useAgenciesQuery({ filter });
  const [canCreateAgencies] = usePermissions([Permissions.CREATE_AGENCIES]);

  return (
    <>
      <Box
        as="h1"
        data-testid="page-title"
        color="primary.700"
        textStyle="h2"
        mb="10px"
      >
        Agencies
      </Box>
      <Flex mt={2} mb={6} justifyContent="space-between">
        <Flex>
          <Input
            aria-label="Search agencies"
            width="320px"
            mx={1}
            autoFocus
            type="search"
            placeholder="Search agencies"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Flex>
        {canCreateAgencies && (
          <InertiaButtonLink
            alignSelf="flex-end"
            href="/agencies/create"
            variant="solidPrimary"
          >
            Add Agency
          </InertiaButtonLink>
        )}
      </Flex>
      <DataTableHeaderRow templateColumns={templateColumns}>
        <LinkSortColumnHeader
          label="Agency Name"
          column="name"
          dataKey="agenciesPaginator"
        />
        <LinkSortColumnHeader
          label="Account Balance"
          column="balance"
          dataKey="agenciesPaginator"
        />
        <LinkSortColumnHeader
          label="Region"
          column="region"
          dataKey="agenciesPaginator"
        />
        <LinkSortColumnHeader
          label="District"
          column="district"
          dataKey="agenciesPaginator"
        />
      </DataTableHeaderRow>
      <Skeleton
        isLoaded={!processing}
        display="Flex"
        flexDirection="column"
        flexGrow="1"
      >
        {agenciesPaginator.data.length > 0 ? (
          <Box data-testid="agencies-list">
            {agenciesPaginator.data.map((agency) => (
              <Grid
                data-testid="agency-row"
                cursor="pointer"
                autoColumns="auto"
                key={agency.id}
                templateColumns={templateColumns}
                borderRadius="md"
                borderWidth="1px"
                onClick={(event) => {
                  event.preventDefault();
                  Inertia.visit(`/agencies/${agency.id}`);
                }}
                alignItems="center"
                py={5}
                px={3}
                mt={2}
              >
                <Box my="auto" color={agency.deleted_at ? 'gray.500' : ''}>
                  {agency.name}
                </Box>
                <Box
                  my="auto"
                  color={agency.deleted_at ? 'gray.500' : ''}
                  textAlign="right"
                  paddingRight={12}
                >
                  {formatCurrency(agency.balance)}
                </Box>
                <Box my="auto" color={agency.deleted_at ? 'gray.500' : ''}>
                  {agency.region?.name || '(Nationwide)'}
                </Box>
                <Box my="auto" color={agency.deleted_at ? 'gray.500' : ''}>
                  {agency.district?.name}
                </Box>
              </Grid>
            ))}
          </Box>
        ) : (
          <Box
            my="auto"
            borderRadius="md"
            borderWidth="1px"
            textAlign="center"
            p={4}
            mt={2}
          >
            No Agencies
          </Box>
        )}
        <Spacer />
        <Paginator paginator={agenciesPaginator} />
      </Skeleton>
    </>
  );
};

Agencies.layout = (page: ReactElement) => <AppLayout children={page} />;

export default Agencies;
