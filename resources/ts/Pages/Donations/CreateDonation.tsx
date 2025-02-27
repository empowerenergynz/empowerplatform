import React, {
  ChangeEventHandler,
  FormEvent,
  ReactElement,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import AppLayout from 'src/Layouts/AppLayout';
import { Donation } from 'src/Types/Donation';
import BackButton from 'src/Components/Common/BackButton';
import AddressGpsAutocomplete from 'src/Components/Forms/AddressGpsAutocomplete';
import { useForm, usePage } from '@inertiajs/inertia-react';
import BorderBox from 'src/Theme/Components/BorderBox';
import FormInputWithLabel from 'src/Components/Forms/FormInputWithLabel';
import InertiaButtonLink from 'src/Theme/Components/InertiaButtonLink';
import { User } from 'src/Types/User';
import usePermissions from 'src/Hooks/usePermissions';
import { Permissions } from 'src/Types/Permission';
import { Page } from '@inertiajs/inertia';
import { AppSharedProps } from 'src/Types/AppSharedProps';
import AutoComplete, {
  AutoCompleteOption,
} from 'src/Theme/Components/AutoComplete';
import SelectFilter from 'src/Theme/Components/SelectFilter';

interface CreateDonationPageProps {
  donation?: Donation;
  donors?: User[];
  retailers: string[];
}
export const OTHER_RETAILER = '_other';

const CreateDonation = ({
  donation,
  donors,
  retailers,
}: CreateDonationPageProps) => {
  const [canViewUsers] = usePermissions([Permissions.VIEW_USERS]);

  const {
    props: { authUser },
  } = usePage<Page<AppSharedProps>>();

  const form = useForm({
    address: donation?.address ?? '',
    gps_coordinates: donation?.gps_coordinates ?? '',
    retailer: donation?.retailer || '',
    account_number: donation?.account_number ?? '',
    icp: donation?.icp || '',
    amount: donation?.amount || '',
    is_dollar: donation?.is_dollar ?? true,
    buyback_rate: donation?.buyback_rate ?? '0.00',
    is_active: donation?.is_active ?? true,
    // if the user can't view other users then default to their own user id
    user_id: (donation?.user_id || (canViewUsers ? 0 : authUser.id)).toString(),
  });
  const { errors, setData, post, put, processing, data, transform } = form;

  // Retailer drop down
  // user can select from a list of known retailers, or enter the retailer name in an 'Other...' box.
  const [retailerSelect, setRetailerSelect] = useState<string>(
    !donation?.retailer
      ? ''
      : retailers.includes(donation.retailer)
      ? donation.retailer
      : OTHER_RETAILER
  );

  const onSelectRetailer: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setRetailerSelect(e.target.value);
    setData({
      ...data,
      // clear retailer name if "Other" is selected
      retailer: e.target.value == OTHER_RETAILER ? '' : e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    // check if 'other' retailer matches a known retailer ignoring case
    if (data.retailer.trim() && !retailers.includes(data.retailer)) {
      const retailerLower = data.retailer.trim().toLowerCase();
      const matchingRetailer = retailers.find(
        (r) => r.toLowerCase() == retailerLower
      );
      if (matchingRetailer) {
        transform((data) => ({
          ...data,
          retailer: matchingRetailer,
        }));
      }
    }

    if (donation) {
      put(`/donations/${donation.id}`);
    } else {
      post('/donations');
    }
  };

  const donorAutoCompleteOptions = useMemo<AutoCompleteOption[]>(
    () =>
      (donors || []).map((user) => ({
        value: user.id.toString(),
        label: user.name,
      })),
    [donors]
  );

  const donorName = useMemo<string>(() => {
    return (
      (data.user_id &&
        donors?.find((m) => m.id.toString() === data.user_id)?.name) ||
      ''
    );
  }, [data.user_id, donors]);

  const onNewAddress = (newAddress: string, newGpscoordinates: string) => {
    const newData = {
      ...data,
      address: newAddress,
      gps_coordinates: newGpscoordinates,
    };

    // if the Donation doesn't have an address then it has to be a dollar donation.
    if (!newAddress && !data.is_dollar) {
      newData.is_dollar = true;
      newData.amount = '0';
    }

    setData(newData);
  };

  // if the donation changes between dollar/percent, reset the amount to zero
  const setIsDollar = (isDollar: boolean) => {
    setData({
      ...data,
      is_dollar: isDollar,
      amount: '0',
      buyback_rate: '0.00',
    });
  };

  const backLink = donation ? `/donations/${donation.id}` : '/donations';

  return (
    <VStack alignItems="stretch" spacing={6} w="full">
      <HStack>
        <BackButton
          href={backLink}
          label={`Go to ${donation ? 'donation' : 'donations'} page`}
        />
        <Box as="h1" mb={0} textStyle="h1">
          {donation?.icp || 'Add Donation'}
        </Box>
      </HStack>
      <BorderBox label="DONATION DETAILS">
        <Container
          as="form"
          noValidate={true}
          onSubmit={handleSubmit}
          data-testid="create-donation-form"
          p={0}
        >
          <VStack alignItems="stretch" spacing={4}>
            {canViewUsers && (
              <FormControl isInvalid={'user_id' in errors} isRequired>
                <FormLabel>Donor</FormLabel>
                <AutoComplete
                  onChange={(value) => setData('user_id', value)}
                  options={donorAutoCompleteOptions}
                  value={donorName}
                  placeholder="Please Select"
                  showClear
                />
                <FormErrorMessage>{errors.user_id}</FormErrorMessage>
              </FormControl>
            )}

            <FormInputWithLabel
              label="ICP"
              name="icp"
              data={data}
              setData={setData}
              errors={errors}
              isRequired
            />

            <FormControl isInvalid={'retailer' in errors} isRequired>
              <FormLabel htmlFor="retailer">Retailer</FormLabel>
              <Flex>
                <SelectFilter
                  data-testid="retailer-select"
                  onChange={onSelectRetailer}
                  value={retailerSelect}
                  flexShrink={0}
                >
                  <option value="" disabled>
                    Please select
                  </option>
                  {retailers.map((retailer) => (
                    <option value={retailer} key={retailer}>
                      {retailer}
                    </option>
                  ))}
                  <option value={OTHER_RETAILER}>Other</option>
                </SelectFilter>

                {retailerSelect == OTHER_RETAILER && (
                  <InputGroup ml={2}>
                    <Input
                      aria-label="retailer"
                      variant="outline"
                      id="retailer"
                      name="retailer"
                      data-testid="retailer"
                      value={data.retailer}
                      onChange={(e) => setData('retailer', e.target.value)}
                    />
                  </InputGroup>
                )}
              </Flex>
              <FormErrorMessage>{errors.retailer}</FormErrorMessage>
              {retailerSelect == OTHER_RETAILER && (
                <FormHelperText data-testid="retailer-not-listed">
                  If your retailer isn’t listed it means they haven’t joined
                  yet. Write them in here and we’ll let them know they’re
                  missing out!
                </FormHelperText>
              )}
            </FormControl>

            <FormInputWithLabel
              label="Account Number"
              name="account_number"
              data={data}
              setData={setData}
              errors={errors}
              isRequired
            />

            <FormControl isInvalid={'address' in errors}>
              <FormLabel htmlFor="address">Donation Address</FormLabel>
              <AddressGpsAutocomplete
                label="address"
                address={data.address}
                setData={onNewAddress}
                isClearable
              />
              <FormErrorMessage>{errors.address}</FormErrorMessage>
            </FormControl>

            <FormInputWithLabel
              label="Donation GPS"
              name="gps_coordinates"
              data={data}
              setData={setData}
              errors={errors}
            />

            <FormControl
              isInvalid={'is_dollar' in errors || 'amount' in errors}
              isRequired
            >
              <FormLabel htmlFor="amount">Donation Amount</FormLabel>
              <Flex>
                <SelectFilter
                  id="is_dollar"
                  data-testid="donation-type"
                  onChange={(e) => setIsDollar(e.target.value == 'true')}
                  value={data.is_dollar.toString()}
                  isDisabled={data.address == ''}
                  isRequired
                  flexShrink={0}
                >
                  <option value="true">Dollar</option>
                  <option value="false">Percent</option>
                </SelectFilter>

                <InputGroup w="130px" ml={2}>
                  {data.is_dollar && (
                    <InputLeftElement
                      pointerEvents="none"
                      fontSize="1.2em"
                      children="$"
                    />
                  )}
                  <Input
                    aria-label="amount"
                    variant="outline"
                    id="amount"
                    name="amount"
                    data-testid="donation-amount"
                    type="number"
                    value={data.amount}
                    min="0"
                    max={data.is_dollar ? undefined : 100}
                    onChange={(e) => setData('amount', e.target.value)}
                  />
                  {!data.is_dollar && (
                    <InputRightElement
                      pointerEvents="none"
                      fontSize="1.2em"
                      children="%"
                    />
                  )}
                </InputGroup>
              </Flex>
              <FormErrorMessage>{errors.is_dollar}</FormErrorMessage>
              <FormErrorMessage>{errors.amount}</FormErrorMessage>
            </FormControl>

            {!data.is_dollar && (
              <FormControl isInvalid={'buyback_rate' in errors} isRequired>
                <FormLabel htmlFor="buyback-rate">Buy-Back Rate</FormLabel>
                <InputGroup w="130px">
                  <InputLeftElement
                    pointerEvents="none"
                    fontSize="1.2em"
                    children="$"
                  />
                  <Input
                    aria-label="buy-back rate"
                    variant="outline"
                    id="buyback-rate"
                    name="buyback-rate"
                    data-testid="donation-buyback-rate"
                    type="number"
                    value={data.buyback_rate}
                    min="0"
                    max={100}
                    onChange={(e) => setData('buyback_rate', e.target.value)}
                  />
                </InputGroup>
                <Text mt={2}>
                  Check your power bill for your buy-back rate, or{' '}
                  <Link
                    color="primary.200"
                    href="https://www.mysolarquotes.co.nz/about-solar-power/residential/solar-power-buy-back-rates-nz/"
                    target="_blank"
                  >
                    click here
                  </Link>{' '}
                  for information.
                </Text>
                <Text mt={2}>
                  We are also open to generous people putting in a higher
                  buy-back rate to increase their donation&hellip;
                </Text>
                <FormErrorMessage>{errors.buyback_rate}</FormErrorMessage>
              </FormControl>
            )}

            <FormControl isInvalid={'is_active' in errors}>
              <FormLabel htmlFor="is_active">Status</FormLabel>
              <SelectFilter
                id="is_active"
                data-testid="donation-status-filter"
                onChange={(e) => setData('is_active', e.target.value == 'true')}
                color={data.is_active ? 'green.500' : 'orange.500'}
                backgroundColor={data.is_active ? 'green.50' : 'orange.50'}
                value={data.is_active.toString()}
                isDisabled={data.retailer == ''}
                isRequired
              >
                <option value="true">ACTIVE</option>
                <option value="false">PAUSED</option>
              </SelectFilter>
              <FormErrorMessage>{errors.is_active}</FormErrorMessage>
            </FormControl>

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

CreateDonation.layout = (page: ReactElement) => <AppLayout children={page} />;

export default CreateDonation;
