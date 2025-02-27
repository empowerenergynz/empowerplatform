import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  MenuItem,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { User } from 'src/Types/User';
import { Inertia } from '@inertiajs/inertia';

export interface ArchiveButtonProps {
  user: User;
}

const ArchiveButton = ({ user }: ArchiveButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [processing, setProcessing] = useState<boolean>(false);

  const cancelRef = useRef<HTMLButtonElement>(null);
  const archiveUser = () => {
    setProcessing(true);
    Inertia.delete(`/users/${user.id}`);
  };

  return (
    <>
      <MenuItem onClick={onOpen} textColor="black" backgroundColor="purple">
        Archive
      </MenuItem>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Archive User
            </AlertDialogHeader>
            <AlertDialogBody>
              Changing this User’s status to archived will prevent them
              accessing the app, this can be undone by changing their status
              back to active in the future. Do you still want to continue?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>

              <Button
                type="submit"
                colorScheme="red"
                onClick={archiveUser}
                ml={3}
                isLoading={processing}
              >
                Archive
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ArchiveButton;
