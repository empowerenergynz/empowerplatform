/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react';
import { FileRejection, useDropzone, ErrorCode } from 'react-dropzone';
import {
  Box,
  Button,
  Flex,
  IconButton,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons';
import { formatBytes } from 'src/Types/Upload';

interface FilesDropzoneProps {
  onDrop: <T extends File>(acceptedFiles: T[]) => void;
  onRemove: (index: number) => void;
  files: File[];
}

const FilesDropzone = ({ onDrop, onRemove, files }: FilesDropzoneProps) => {
  const [error, setError] = useState('');
  const onDropFiles = (
    acceptedFiles: File[],
    fileRejections: FileRejection[]
  ) => {
    onDrop(files.concat(acceptedFiles));
    setError('');
    switch (fileRejections[0]?.errors[0]?.code) {
      case ErrorCode.FileTooLarge:
        setError(
          'The %s file is too large'.replace('%s', fileRejections[0].file.name)
        );
        break;
      case ErrorCode.FileInvalidType:
        setError(
          'The %s file is invalid'.replace('%s', fileRejections[0].file.name)
        );
        break;
      default:
        break;
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024,
    onDrop: onDropFiles,
  });

  const removeFile = (index: number) => {
    onRemove(index);
  };

  const filesList = files.map((file, index) => (
    <ListItem key={file.name}>
      {file.name} - {formatBytes(file.size)}
      <IconButton
        size="xs"
        aria-label="Remove file"
        icon={<DeleteIcon />}
        ml={1}
        onClick={() => removeFile(index)}
      />
    </ListItem>
  ));

  return (
    <Box w="full">
      <Flex
        {...getRootProps()}
        p="20px"
        borderWidth="2px"
        borderRadius="4px"
        borderColor="#A0AEC0"
        borderStyle="dashed"
        backgroundColor="#fafafa"
        color="#bdbdbd"
        flexDirection="column"
        alignItems="center"
        data-cy="dropzone"
      >
        <input
          {...getInputProps()}
          data-cy="file-input"
          aria-label="Files upload"
        />
        <Flex
          backgroundColor="gray.500"
          boxSize="32px"
          borderRadius="32px"
          mb="3"
        >
          <ArrowUpIcon m="auto" color="white" fontSize="xl" />
        </Flex>
        <Button variant="outline">Add File</Button>
        <br />
        <Text textAlign="center">or drop files to upload</Text>
      </Flex>
      {filesList.length > 0 && (
        <Box mt="2" p="1">
          <Text>Files</Text>
          <UnorderedList>{filesList}</UnorderedList>
        </Box>
      )}
      <Text mt="2" textAlign="center" color="red.500">
        {error}
      </Text>
    </Box>
  );
};

export default FilesDropzone;
