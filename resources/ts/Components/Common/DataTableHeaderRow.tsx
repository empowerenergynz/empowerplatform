import React, { ReactNode } from 'react';
import { Grid, GridProps } from '@chakra-ui/react';

interface DataTableHeaderRowProps extends GridProps {
  children: ReactNode;
}

const DataTableHeaderRow = ({
  children,
  ...gridProps
}: DataTableHeaderRowProps) => {
  return (
    <Grid
      borderRadius={'md'}
      p={1}
      backgroundColor={'body.50'}
      fontSize={'md'}
      fontWeight={'bold'}
      color={'body.800'}
      {...gridProps}
    >
      {children}
    </Grid>
  );
};

export default DataTableHeaderRow;
