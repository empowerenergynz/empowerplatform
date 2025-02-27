import React, { useState } from 'react';
import { Button, Icon, InputGroup, InputRightElement } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const PasswordInputWrapper = ({ children }: { children: JSX.Element }) => {
  const [show, setShow] = useState<boolean>(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      {React.cloneElement(children, { type: show ? 'text' : 'password' })}
      <InputRightElement width="3.5rem">
        <Button
          aria-label={show ? 'Hide' : 'Show'}
          type="button"
          h="1.75rem"
          size="sm"
          onClick={handleClick}
        >
          <Icon as={show ? ViewOffIcon : ViewIcon} />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInputWrapper;
