import React, { MouseEvent, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import useDeleteAttachment from 'src/Hooks/useDeleteAttachment';
import { Upload } from 'src/Types/Upload';
import { DeleteIcon } from '@chakra-ui/icons';

const DeleteAttachment = ({ attachment }: { attachment: Upload }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const deleteAttachment = useDeleteAttachment();

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onOpen();
  };

  return (
    <>
      <IconButton
        position="absolute"
        right={0}
        aria-label="Delete attachment"
        icon={<DeleteIcon />}
        size="sm"
        data-testid="delete-attachment"
        onClick={onClick}
      />

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete this attachment?
            </AlertDialogHeader>
            <AlertDialogBody>
              This attachment will permanently be removed and cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>

              <Button
                type="submit"
                colorScheme="red"
                ml={3}
                onClick={() => deleteAttachment(attachment)}
                data-testid="submit-delete-attachment"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteAttachment;
