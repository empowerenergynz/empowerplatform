import React, { useState } from 'react';
import { Grid } from '@chakra-ui/react';
import { isImage, Upload } from 'src/Types/Upload';
import Attachment from 'src/Components/Attachments/Attachment';
import AttachmentLightbox from 'src/Components/Attachments/AttachmentLightbox';

const AttachmentsGallery = ({ attachments }: { attachments: Upload[] }) => {
  const [attachmentIndex, setAttachmentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const onClickOnAttachment = (attachment: Upload, index: number) => {
    if (isImage(attachment)) {
      setAttachmentIndex(index);
      setIsLightboxOpen(true);
    } else {
      window.open(attachment.url, '__blank');
    }
  };

  const onMoveTo = (index: number) => {
    setAttachmentIndex(index);
  };

  const onClose = () => {
    setIsLightboxOpen(false);
  };

  return (
    <Grid
      mt="20px"
      templateColumns="repeat(5, 1fr)"
      gap={2}
      data-testid="attachments"
    >
      {attachments.map((upload: Upload, index) => {
        return (
          <Attachment
            upload={upload}
            key={upload.id}
            onClick={() => onClickOnAttachment(upload, index)}
          />
        );
      })}
      {isLightboxOpen && (
        <AttachmentLightbox
          attachments={attachments}
          attachmentIndex={attachmentIndex}
          onMoveTo={onMoveTo}
          onClose={onClose}
        />
      )}
    </Grid>
  );
};

export default AttachmentsGallery;
