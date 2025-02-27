import React from 'react';
import { Flex, Icon, IconButton, Text, VStack } from '@chakra-ui/react';
import { formatBytes, isImage, Upload } from 'src/Types/Upload';
import Lightbox from 'react-image-lightbox';
import AttachmentIcon from 'src/Components/Attachments/AttachmentIcon';
import { ImageIcon } from 'src/Icons/ImageIcon';
import { DownloadIcon } from 'src/Icons/DownloadIcon';

const AttachmentLightbox = ({
  attachments,
  attachmentIndex,
  onMoveTo,
  onClose,
}: {
  attachments: Upload[];
  attachmentIndex: number;
  onMoveTo: (index: number) => void;
  onClose: () => void;
}) => {
  const titles = attachments.map((upload) => upload.name);

  const onClickDownload = (upload: Upload) => {
    window.open(upload.url, '_blank');
  };

  const downloadButton = (
    <IconButton
      aria-label="Download document"
      icon={<DownloadIcon />}
      variant="link"
      colorScheme="secondary"
      fontSize="35px"
      onClick={() => onClickDownload(attachments[attachmentIndex])}
    />
  );
  const toolbarButtons = [downloadButton];

  return (
    <Lightbox
      toolbarButtons={toolbarButtons}
      mainSrc={attachments[attachmentIndex].url}
      nextSrc={attachments[(attachmentIndex + 1) % attachments.length].url}
      prevSrc={
        attachments[
          (attachmentIndex + attachments.length - 1) % attachments.length
        ].url
      }
      onCloseRequest={onClose}
      onMovePrevRequest={() => {
        onMoveTo(
          (attachmentIndex + attachments.length - 1) % attachments.length
        );
      }}
      onMoveNextRequest={() => {
        onMoveTo((attachmentIndex + 1) % attachments.length);
      }}
      imageLoadErrorMessage={
        <AttachmentIcon
          upload={attachments[attachmentIndex]}
          boxSize={24}
          color="white"
        />
      }
      reactModalStyle={{
        overlay: { backgroundColor: 'rgba(28, 68, 127, 0.5)' }, // color:primary.700
      }}
      imageTitle={
        <Flex>
          {isImage(attachments[attachmentIndex]) ? (
            <Icon as={ImageIcon} margin="auto" color="secondary.600" />
          ) : (
            <AttachmentIcon
              boxSize={5}
              upload={attachments[attachmentIndex]}
              color="secondary.600"
            />
          )}
          <VStack marginY={6} marginLeft={2} color="primary.50">
            <Text w="100%" fontSize="xs">
              {titles[attachmentIndex]}
            </Text>
            <Text w="100%" fontSize="xs">
              {`${
                isImage(attachments[attachmentIndex]) ? 'image' : 'document'
              } - ${formatBytes(attachments[attachmentIndex].size)}`}
            </Text>
          </VStack>
        </Flex>
      }
    />
  );
};

export default AttachmentLightbox;
