import React, { FormEvent, ReactElement, useEffect, useState } from 'react';
import {
  Button,
  VStack,
  Container,
  Flex,
  FormLabel,
  FormControl,
  Checkbox,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import AppLayout from 'src/Layouts/AppLayout';
import BorderBox from 'src/Theme/Components/BorderBox';
import { useForm } from '@inertiajs/inertia-react';
import FormInputWithLabel from 'src/Components/Forms/FormInputWithLabel';
import { District, Region } from 'src/Types/Region';
import { onlyAllowDigits } from 'src/lib';
import { Credit } from 'src/Types/Credit';
import { Retailer } from 'src/Types/Retailer';
import ConfirmAlertDialog from 'src/Components/Credits/ConfirmAlertDialog';

interface CreateCreditPageProps {
  credit?: Credit;
  regions: Region[];
  retailers: Retailer[];
  approvedAmounts: string[];
  balance?: number;
}

const CreateCredit = ({
  credit,
  regions,
  retailers,
  approvedAmounts,
  balance,
}: CreateCreditPageProps) => {
  const [region, setRegion] = useState<Region | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [autoAmount, setAutoAmount] = useState('');
  const form = useForm({
    name: credit?.name ?? '',
    account: credit?.account || '',
    amount: credit?.amount.toString() || '',
    notes: credit?.notes ?? '',
    retailer_id: credit?.retailer_id || '',
    region_id: credit?.region_id || '',
    district_id: credit?.district_id || '',
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const handleAlertClose = () => setIsAlertOpen(false);

  const { errors, setData, post, processing, data } = form;

  const handleSubmit = (e?: FormEvent<HTMLElement>) => {
    e?.preventDefault();
    if (
      balance !== undefined &&
      balance !== null &&
      Number(form.data.amount) > balance
    ) {
      setIsAlertOpen(true);
      return;
    }

    if (credit) {
      // TODO?
      // put(`/credits/${credit.id}`);
    } else {
      post('/credits', {
        onSuccess: () => {
          form.reset();
          setAutoAmount('');
        },
      });
    }
  };

  useEffect(() => {
    if (form.data.region_id != region?.id) {
      form.setData('district_id', '');

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

  return (
    <>
      <BorderBox label="Client Allocation">
        <Container
          as="form"
          noValidate={true}
          onSubmit={handleSubmit}
          data-testid="create-credit-form"
          p={0}
        >
          <VStack alignItems="stretch" spacing={4}>
            <FormInputWithLabel
              label="Client Name"
              name="name"
              data={data}
              setData={setData}
              errors={errors}
              isRequired
              data-lpignore
            />

            <FormInputWithLabel
              label="Account Number"
              name="account"
              type="number"
              min={0}
              data={data}
              setData={setData}
              errors={errors}
              isRequired
              onKeyDown={onlyAllowDigits}
            />

            <FormInputWithLabel
              label="Retailer"
              name="retailer_id"
              data={data}
              type="select"
              options={retailers}
              setData={setData}
              errors={errors}
              isRequired
              data-lpignore
            />

            <FormInputWithLabel
              label="Region"
              name="region_id"
              data={data}
              type="select"
              options={regions}
              setData={setData}
              errors={errors}
              isRequired
              data-lpignore
            />

            <FormInputWithLabel
              label="District"
              name="district_id"
              data={data}
              type="select"
              options={districts}
              isDisabled={!form.data.region_id}
              setData={setData}
              errors={errors}
              isRequired
              data-lpignore
            />

            <FormControl isRequired>
              <FormLabel>Credit Amount</FormLabel>
            </FormControl>

            <Flex
              backgroundColor="body.50"
              border="1px solid"
              borderColor="body.100"
              direction="column"
              gap="12px"
              padding="10px"
              justifyItems="stretch"
              mt="0 !important" // remove the default Stack spacing
            >
              <Flex justifyContent="space-between">
                {approvedAmounts.map((v) => (
                  <Checkbox
                    key={v}
                    isChecked={autoAmount == v}
                    onChange={() => {
                      setAutoAmount(v);
                      form.setData('amount', v);
                    }}
                  >
                    ${v}
                  </Checkbox>
                ))}
              </Flex>
              <Checkbox
                isChecked={autoAmount == 'custom'}
                onChange={() => setAutoAmount('custom')}
              >
                Custom
              </Checkbox>

              {autoAmount == 'custom' && (
                <InputGroup>
                  <InputLeftAddon children="$" />
                  <FormInputWithLabel
                    label=""
                    name="amount"
                    type="number"
                    min={0}
                    data={data}
                    setData={setData}
                    errors={errors}
                    isRequired
                    onKeyDown={onlyAllowDigits}
                    backgroundColor="white"
                    borderTopLeftRadius={0}
                    borderBottomLeftRadius={0}
                    data-testid="amount"
                  />
                </InputGroup>
              )}

              <FormInputWithLabel
                label="Notes"
                name="notes"
                data={data}
                setData={setData}
                errors={errors}
                isRequired={!approvedAmounts.includes(form.data.amount)}
                data-lpignore
                backgroundColor="white"
              />
            </Flex>

            <Button
              type="submit"
              variant="solidPrimary"
              isLoading={processing}
              w="100%"
            >
              Create Allocation
            </Button>
          </VStack>
        </Container>
      </BorderBox>
      <ConfirmAlertDialog isOpen={isAlertOpen} onClose={handleAlertClose} />
    </>
  );
};

CreateCredit.layout = (page: ReactElement) => <AppLayout children={page} />;

export default CreateCredit;
