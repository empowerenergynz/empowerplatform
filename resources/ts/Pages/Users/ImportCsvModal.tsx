import AppLayout from 'src/Layouts/AppLayout';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import React, { FormEventHandler, ReactElement } from 'react';
import { InertiaFormProps, useForm } from '@inertiajs/inertia-react';
import { kebabCase } from 'lodash';

interface ImportDonorsModalProps {
  onClose: () => void;
  endpoint: string;
  title: string;
}

const ImportCsvModal = ({
  onClose,
  endpoint,
  title,
}: ImportDonorsModalProps) => {
  const form: InertiaFormProps<{ csv: File | null }> = useForm({
    csv: null,
  } as { csv: File | null });
  const { post, data, setData, processing, errors } = form;

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(endpoint, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Modal isOpen size="xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="white.200">
        <Container
          as="form"
          noValidate={true}
          onSubmit={onSubmit}
          maxWidth="unset"
          data-testid={kebabCase(title + ' modal')}
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
              {title}
            </Box>
          </ModalHeader>
          <ModalBody>
            <VStack alignItems="stretch" spacing={4}>
              <FormControl isInvalid={'csv' in errors} isRequired>
                <FormLabel htmlFor="csv">CSV File</FormLabel>
                <InputGroup>
                  <Input
                    height="100%"
                    p={3}
                    aria-label="CSV File"
                    id="csv"
                    name="csv"
                    data-testid="csv"
                    type="file"
                    accept=".csv"
                    onChange={(e) =>
                      e.target.files && setData('csv', e.target.files[0])
                    }
                  />
                </InputGroup>
                <FormErrorMessage>{errors.csv}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter borderTopWidth="1px" p={6} pt={3}>
            <ButtonGroup>
              <Button variant="solid" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="solidPrimary"
                isDisabled={!data.csv}
                isLoading={processing}
              >
                Import
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </Container>
      </ModalContent>
    </Modal>
  );
};

ImportCsvModal.layout = (page: ReactElement) => <AppLayout children={page} />;

export default ImportCsvModal;
