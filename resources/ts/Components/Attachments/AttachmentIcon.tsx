import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';
import { Upload } from 'src/Types/Upload';
import { WordIcon } from 'src/Icons/WordIcon';
import { PdfIcon } from 'src/Icons/PdfIcon';
import { CsvIcon } from 'src/Icons/CsvIcon';
import { AttachmentIcon as ChakraAttachmentIcon } from '@chakra-ui/icons';

type AttachmentIconProps = IconProps & {
  upload: Upload;
};

const AttachmentIcon = ({ upload, ...iconProps }: AttachmentIconProps) => {
  let icon = ChakraAttachmentIcon;

  if (upload.mime_type === 'application/pdf') {
    icon = PdfIcon;
  } else if (
    (upload.mime_type === 'text/plain' && upload.name.endsWith('csv')) ||
    upload.mime_type === 'text/csv'
  ) {
    icon = CsvIcon;
  } else if (
    upload.mime_type === 'application/msword' ||
    upload.mime_type.startsWith(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
  ) {
    icon = WordIcon;
  }

  return <Icon as={icon} {...iconProps} margin="auto" />;
};

export default AttachmentIcon;
