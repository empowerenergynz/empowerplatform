import React, { ReactNode } from 'react';
import {
  Box,
  Button,
  Collapse,
  Flex,
  GridProps,
  BoxProps,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

interface CollapsibleContainerProps extends GridProps {
  label: string;
  defaultOpen?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  childProps?: BoxProps;
  children: ReactNode;
}

const CollapsibleContainer = ({
  label,
  defaultOpen = false,
  onCollapseChange,
  childProps = {},
  children,
  ...containerProps
}: CollapsibleContainerProps) => {
  const [show, setShow] = React.useState(defaultOpen);
  const handleToggle = () => {
    if (onCollapseChange) {
      onCollapseChange(show);
    }
    setShow(!show);
  };

  return (
    <Box {...containerProps}>
      <Flex
        borderWidth="1px"
        borderColor="gray.200"
        px="6"
        py="3"
        lineHeight="6"
        backgroundColor="gray.50"
        fontSize="md"
        fontWeight="bold"
        color="gray.600"
        justifyContent="space-between"
      >
        {label}
        <Button
          variant="outline"
          px="2"
          mt="-1"
          mb="-2"
          size="sm"
          borderWidth="1px"
          borderColor="gray.200"
          backgroundColor="gray.50"
          onClick={handleToggle}
        >
          {show ? <ChevronUpIcon w="14px" /> : <ChevronDownIcon w="14px" />}
        </Button>
      </Flex>
      <Collapse in={show}>
        <Box
          borderWidth="1px"
          borderTopWidth="0"
          borderColor="gray.200"
          p="2"
          {...childProps}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

export default CollapsibleContainer;
