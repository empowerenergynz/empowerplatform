import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import FormInputWithLabel from 'src/Components/Forms/FormInputWithLabel';
import { useForm } from '@inertiajs/inertia-react';

interface RejectCreditModalProps {
  disclosure: UseDisclosureReturn;
  onSubmit: (reason: string) => void;
  processing: boolean;
}

const RejectCreditModal = ({
  disclosure,
  onSubmit,
  processing,
}: RejectCreditModalProps) => {
  const form = useForm({
    reason: '',
  });

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent>
        <Container
          as="form"
          noValidate={true}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form.data.reason);
          }}
          maxWidth="unset"
          data-testid="rejection-reason-modal"
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
              Reject Credit(s)
            </Box>
          </ModalHeader>
          <ModalBody>
            <FormInputWithLabel
              label="Rejection Reason"
              name="reason"
              data={form.data}
              setData={form.setData}
              isRequired
            />
          </ModalBody>
          <ModalFooter borderTopWidth="1px" p={6} pt={3}>
            <ButtonGroup>
              <Button
                type="button"
                variant="solid"
                // colorScheme="gray"
                onClick={() => disclosure.onClose()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="solidPrimary"
                colorScheme="red"
                isLoading={processing}
                data-testid="reject-submit-btn"
              >
                Reject
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </Container>
      </ModalContent>
    </Modal>
  );
};

export default RejectCreditModal;
