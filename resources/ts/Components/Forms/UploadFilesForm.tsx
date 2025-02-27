import FilesDropzone from 'src/Components/Forms/FilesDropzone';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import useUploadFilesForm from 'src/Hooks/Forms/useUploadFilesForm';

interface UploadFilesFormProps {
  postUrl: string;
}

const UploadFilesForm = ({ postUrl }: UploadFilesFormProps) => {
  const {
    formState: { data, setData, errors },
    handlers: { submit },
  } = useUploadFilesForm(postUrl);
  const formRef = useRef<HTMLFormElement>(null);

  const onDropFiles = (uploadedFiles: File[]) => {
    setData('files', uploadedFiles);
  };

  const onRemoveFiles = (index: number) => {
    const filesToKeep = data.files.filter((file, idx) => idx !== index);
    setData('files', filesToKeep);
  };

  useEffect(() => {
    // automatically submit the form when files have been uploaded
    if (data.files.length > 0) {
      submit();
    }
  }, [data.files]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form onSubmit={submit} data-testid="upload-files-form" ref={formRef}>
      <FormControl isInvalid={'files' in errors}>
        <FilesDropzone
          onDrop={onDropFiles}
          onRemove={onRemoveFiles}
          files={data.files}
        />
        <FormErrorMessage>{errors.files}</FormErrorMessage>
      </FormControl>
    </form>
  );
};

export default UploadFilesForm;
