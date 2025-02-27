import React, { FormEvent, ReactElement, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  VStack,
  Container,
} from '@chakra-ui/react';
import AppLayout from 'src/Layouts/AppLayout';
import InertiaButtonLink from 'src/Theme/Components/InertiaButtonLink';
import BackButton from 'src/Components/Common/BackButton';
import BorderBox from 'src/Theme/Components/BorderBox';
import { useForm } from '@inertiajs/inertia-react';
import FormInputWithLabel from 'src/Components/Forms/FormInputWithLabel';
import { Agency } from 'src/Types/Agency';
import { District, Region } from 'src/Types/Region';
import {
  DATE_TIME_INPUT_FORMAT,
  formatCurrency,
  formatDateTime,
  onlyAllowDigits,
} from 'src/lib';

interface CreateAgencyPageProps {
  agency?: Agency;
  regions: Region[];
  liveBalance?: number;
}

const CreateAgency = ({
  agency,
  regions,
  liveBalance,
}: CreateAgencyPageProps) => {
  const [region, setRegion] = useState<Region | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const form = useForm({
    name: agency?.name ?? '',
    balance: agency?.balance || '0',
    balance_date: formatDateTime(
      agency?.balance_date || new Date().toISOString(),
      DATE_TIME_INPUT_FORMAT
    ),
    region_id: agency?.region_id || '',
    district_id: agency?.district_id || '',
  });

  const { errors, setData, post, put, processing, data } = form;

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    form.transform((data) => ({
      ...data,
      balance_date: new Date(data.balance_date).toISOString(),
    }));
    e.preventDefault();
    if (agency) {
      put(`/agencies/${agency.id}`);
    } else {
      post('/agencies');
    }
  };

  const backLink = agency ? `/agencies/${agency.id}` : '/agencies';

  useEffect(() => {
    if (form.data.region_id != region?.id) {
      if (region) {
        // if we already have a region then it must've changed (not first load), so reset the district
        form.setData('district_id', '');
      }
      // find the newly selected region & districts
      const newRegion =
        (form.data.region_id &&
          regions.find((r) => r.id == form.data.region_id)) ||
        null;
      setRegion(newRegion);
      setDistricts(newRegion?.districts || []);
      if (newRegion?.districts?.length == 1) {
        setData('district_id', newRegion.districts[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.data.region_id, regions, setDistricts]);

  // if the balance changes, update the balance_date
  const [haveChangedDate, setHaveChangeDate] = useState(false);
  useEffect(() => {
    if (agency && !haveChangedDate && form.data.balance != agency.balance) {
      form.setData(
        'balance_date',
        formatDateTime(new Date(), DATE_TIME_INPUT_FORMAT)
      );
      setHaveChangeDate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.data.balance]);

  return (
    <VStack alignItems="stretch" spacing={6} w="full">
      <Flex justifyContent="space-between">
        <HStack>
          <BackButton
            href={backLink}
            label={`Go to ${agency ? 'agency' : 'agencies'} page`}
          />
          <Box as="h1" mb={0} textStyle="h1">
            {agency?.name || 'Add Agency'}
          </Box>
        </HStack>
      </Flex>
      <BorderBox label="AGENCY DETAILS">
        <Container
          as="form"
          noValidate={true}
          onSubmit={handleSubmit}
          data-testid="create-agency-form"
          p={0}
        >
          <VStack alignItems="stretch" spacing={4}>
            <FormInputWithLabel
              label="Name"
              name="name"
              data={data}
              setData={setData}
              errors={errors}
              isRequired
              data-lpignore
            />
            {agency && (
              <HStack fontSize="16px">
                <Box width="50%">
                  <Box fontWeight="medium">Balance Datum</Box>
                  <Box>
                    {formatCurrency(agency.balance)}
                    <Box as="small" marginLeft={4}>
                      (as at {formatDateTime(agency.balance_date)})
                    </Box>
                  </Box>
                </Box>
                <Box width="50%">
                  <Box fontWeight="medium">Calculated "Live" Balance</Box>
                  <Box>{formatCurrency(liveBalance || 0)}</Box>
                </Box>
              </HStack>
            )}

            <HStack>
              <FormInputWithLabel
                label={agency ? 'New Balance Datum' : 'Balance'}
                name="balance"
                type="number"
                min={0}
                data={data}
                setData={setData}
                errors={errors}
                isRequired
                onKeyDown={onlyAllowDigits}
              />

              <FormInputWithLabel
                label="Balance Date"
                name="balance_date"
                type="datetime-local"
                data={data}
                setData={setData}
                errors={errors}
                isRequired
              />
            </HStack>

            <FormInputWithLabel
              label="Region"
              name="region_id"
              data={data}
              type="select"
              options={regions}
              nullOptionLabel="(Nationwide)"
              setData={setData}
              errors={errors}
              data-lpignore
            />

            <FormInputWithLabel
              label="District"
              name="district_id"
              data={data}
              type="select"
              options={districts}
              nullOptionLabel={form.data.region_id ? '(Region-wide)' : ''}
              isDisabled={!form.data.region_id}
              setData={setData}
              errors={errors}
              data-lpignore
            />

            <ButtonGroup alignSelf="end" spacing={3} mt={4} py={4}>
              <InertiaButtonLink href={backLink} colorScheme="gray">
                Cancel
              </InertiaButtonLink>
              <Button
                type="submit"
                variant="solidPrimary"
                isLoading={processing}
              >
                Save
              </Button>
            </ButtonGroup>
          </VStack>
        </Container>
      </BorderBox>
    </VStack>
  );
};

CreateAgency.layout = (page: ReactElement) => <AppLayout children={page} />;

export default CreateAgency;
