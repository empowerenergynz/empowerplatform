import React, { MouseEventHandler, useState } from 'react';
import { Box, Flex, GridItem, Image, Text } from '@chakra-ui/react';
import { isImage, Upload } from 'src/Types/Upload';
import { format, parseISO } from 'date-fns';
import AttachmentIcon from 'src/Components/Attachments/AttachmentIcon';
import DeleteAttachment from 'src/Components/Attachments/DeleteAttachment';

const Attachment = ({
  upload,
  onClick,
}: {
  upload: Upload;
  onClick?: MouseEventHandler;
}) => {
  const [displayDeleteButton, setDisplayDeleteButton] = useState(false);

  return (
    <GridItem data-testid="attachment-item" onClick={onClick} cursor="pointer">
      <Flex
        boxSize="150px"
        position="relative"
        overflow="hidden"
        justifyContent="center"
        alignItems="center"
        onMouseEnter={() => {
          setDisplayDeleteButton(true);
        }}
        onMouseLeave={() => {
          setDisplayDeleteButton(false);
        }}
      >
        {/* Do not remove the following Box, it is used for alignment */}
        <Box>
          {upload.can_be_deleted && (
            <Box display={displayDeleteButton ? 'block' : 'none'}>
              <DeleteAttachment attachment={upload} />
            </Box>
          )}
          <Flex minH={'85px'} alignItems={'center'}>
            {isImage(upload) ? (
              <Image src={upload.url} alt={upload.name} height="100%" />
            ) : (
              <AttachmentIcon upload={upload} boxSize={12} color="blue.600" />
            )}
          </Flex>
        </Box>
        <Text
          paddingX={3}
          paddingY={1}
          title={upload.name}
          bgColor="black.300"
          textColor="white"
          position="absolute"
          bottom="0"
          opacity="0.6"
          width="100%"
          textAlign="center"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
        >
          {upload.name}
        </Text>
      </Flex>
      <Text textAlign="center" color="gray.600" width="150px">
        Uploaded {format(parseISO(upload.created_at), 'h:mm aa MMMM dd yyyy')}
      </Text>
    </GridItem>
  );
};

export default Attachment;
