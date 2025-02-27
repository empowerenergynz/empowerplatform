import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmAlertDialog = ({ isOpen, onClose }: AlertDialogProps) => {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent backgroundColor={'white'}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Budget exceeded
          </AlertDialogHeader>

          <AlertDialogBody>
            Credit request exceeds available budget
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfirmAlertDialog;
