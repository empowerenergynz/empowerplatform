import AppLayout from 'src/Layouts/AppLayout';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FormEventHandler, ReactElement } from 'react';
import { Donation } from 'src/Types/Donation';
import { useForm } from '@inertiajs/inertia-react';
import FormInputWithLabel from 'src/Components/Forms/FormInputWithLabel';
import DeleteButton from 'src/Components/Common/DeleteButton';

interface PastDonationsModalButtonProps {
  donation: Donation;
  onClose: () => void;
}

const CreatePastDonationModal = ({
  donation,
  onClose,
}: PastDonationsModalButtonProps) => {
  const form = useForm({
    icp: donation.icp,
    account_number: donation.account_number,
    date: new Date().toISOString().split('T')[0],
    amount: donation.is_dollar ? donation.amount : '',
  });
  const { post, data, setData, processing, errors } = form;

  const cancelConfirmDisclosure = useDisclosure();

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(`/donations/${donation.id}/history`, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Modal isOpen onClose={() => cancelConfirmDisclosure.onOpen()} size="xl">
      <ModalOverlay />
      <ModalContent backgroundColor="white.200">
        <Container
          as="form"
          noValidate={true}
          onSubmit={onSubmit}
          maxWidth="unset"
          data-testid="record-donation-modal"
          px={0}
        >
          <ModalHeader fontSize="lg" fontWeight="bold" px={0} pt={7}>
            <Box
              as="h1"
              data-testid="modal-title"
              color="primary.700"
              textStyle="h3"
              m={0}
              borderBottomWidth="1px"
              pb={3}
              px={6}
            >
              Record Donation
            </Box>
          </ModalHeader>
          <ModalBody>
            <VStack alignItems="stretch" spacing={4}>
              <FormInputWithLabel
                label="ICP"
                name="icp"
                data={data}
                setData={setData}
                errors={errors}
                isRequired
              />

              <FormInputWithLabel
                label="Date"
                name="date"
                type="date"
                data={data}
                setData={setData}
                errors={errors}
                isRequired
              />

              <FormInputWithLabel
                label="Account Number"
                name="account_number"
                data={data}
                setData={setData}
                errors={errors}
                isRequired
              />

              <FormControl
                isInvalid={'is_dollar' in errors || 'amount' in errors}
                isRequired
              >
                <FormLabel htmlFor="amount">Donation Amount</FormLabel>
                <InputGroup w="130px">
                  <InputLeftElement
                    pointerEvents="none"
                    fontSize="1.2em"
                    children="$"
                  />
                  <Input
                    aria-label="amount"
                    variant="outline"
                    id="amount"
                    name="amount"
                    data-testid="donation-amount"
                    type="number"
                    value={data.amount}
                    min="0"
                    onChange={(e) => setData('amount', e.target.value)}
                  />
                </InputGroup>
                <FormErrorMessage>{errors.amount}</FormErrorMessage>
                {!donation.is_dollar && (
                  <FormHelperText>
                    Should be {parseFloat(donation.amount)}% of buy back;
                    buy-back rate is ${donation.buyback_rate}.
                  </FormHelperText>
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter borderTopWidth="1px" p={6} pt={3}>
            <ButtonGroup>
              <DeleteButton
                buttonText="Cancel"
                title="Cancel"
                message="Are you sure you want to cancel?"
                variant="solid"
                cancelButtonText="No"
                confirmButtonText="Yes"
                onConfirm={onClose}
                disclosure={cancelConfirmDisclosure}
              />
              <Button
                type="submit"
                variant="solidPrimary"
                isLoading={processing}
              >
                Save
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </Container>
      </ModalContent>
    </Modal>
  );
};

CreatePastDonationModal.layout = (page: ReactElement) => (
  <AppLayout children={page} />
);

export default CreatePastDonationModal;
