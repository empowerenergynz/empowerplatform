import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonProps,
  useDisclosure,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

export interface DeleteButtonProps extends ButtonProps {
  title: string;
  message: string;
  buttonText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  disclosure?: UseDisclosureReturn;
}

const DeleteButton = ({
  title,
  message,
  onConfirm,
  buttonText,
  confirmButtonText,
  cancelButtonText,
  disclosure,
  ...rest
}: DeleteButtonProps) => {
  // if the caller wants to externally control the state of this alert then
  // they will provide their own disclosure, otherwise we will use our own
  const myDisclosure = useDisclosure();
  const { isOpen, onOpen, onClose } = disclosure || myDisclosure;

  const [loading, setLoading] = useState(false);

  const cancelRef = useRef<HTMLButtonElement>(null);

  const onDeleteButtonClick = () => {
    setLoading(true);
    onConfirm();
  };
  return (
    <>
      <Button
        type="button"
        variant="solidPrimary"
        onClick={onOpen}
        data-testid="delete-btn"
        {...rest}
      >
        {buttonText || 'Delete'}
      </Button>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            data-testid="delete-modal"
            backgroundColor="white.200"
          >
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>
            <AlertDialogBody>{message}</AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="solid"
                data-testid="delete-cancel-btn"
              >
                {cancelButtonText || 'Cancel'}
              </Button>

              <Button
                type="submit"
                isLoading={loading}
                onClick={onDeleteButtonClick}
                ml={3}
                data-testid="delete-confirm-btn"
                variant="solidPrimary"
              >
                {confirmButtonText || buttonText || 'Delete'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteButton;
