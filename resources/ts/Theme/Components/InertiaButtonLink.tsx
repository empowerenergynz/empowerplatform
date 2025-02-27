import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { Inertia, RequestPayload } from '@inertiajs/inertia';

interface InertiaButtonLinkProps extends ButtonProps {
  href: string;
  data?: RequestPayload;
}

/*In JSDOM, Inertia throws an error when we attempt to use the InertiaLink component with the “as”
prop of the Chakra button component, so we’ve worked around that in this component by using Inertia.visit.*/

const InertiaButtonLink = ({
  href,
  data,
  children,
  ...rest
}: InertiaButtonLinkProps) => {
  return (
    <Button
      as={'a'}
      cursor={'pointer'}
      onClick={(event) => {
        event.preventDefault();
        Inertia.visit(href, { data });
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default InertiaButtonLink;
