import React, { FormEvent } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  Flex,
  Input,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react';

interface CreateCommentFormState {
  body: string;
}

interface CreateCommentFormProps {
  data: CreateCommentFormState;
  errors: Record<keyof CreateCommentFormState, string>;
  setData: (key: keyof CreateCommentFormState, value: string) => void;
  processing: boolean;
  submit: (e: FormEvent) => void;
  wasSuccessful: boolean;
}

/** TODO needs tests **/
const CreateCommentForm = ({
  data,
  errors,
  setData,
  processing,
  submit,
}: CreateCommentFormProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <form onSubmit={submit} data-testid="create-comment-form">
      <Flex
        mt={2}
        flexDirection="column"
        borderRadius="6px"
        borderWidth="1px"
        p={1}
      >
        <Flex alignItems="center" p={1}>
          <FormControl isInvalid={'body' in errors} ml={4}>
            {isOpen ? (
              <Textarea
                aria-label="Comment text"
                variant="unstyled"
                id="body"
                name="body"
                value={data.body}
                onChange={(e) => setData('body', e.target.value)}
                placeholder="Add a comment..."
                autoFocus
              />
            ) : (
              <Input
                data-testid="comment-input"
                aria-label="Comment text"
                onFocus={onOpen}
                variant="unstyled"
                placeholder="Add a comment..."
              />
            )}
            <FormErrorMessage>{errors.body}</FormErrorMessage>
          </FormControl>
        </Flex>
      </Flex>
      {isOpen && (
        <Flex mt={3}>
          <Button
            type="submit"
            background="blue.600"
            color="white"
            disabled={processing}
            size="sm"
            mr={1}
          >
            Save
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={processing}
            size="sm"
            onClick={onClose}
            fontWeight="normal"
          >
            Cancel
          </Button>
        </Flex>
      )}
    </form>
  );
};

export default CreateCommentForm;
