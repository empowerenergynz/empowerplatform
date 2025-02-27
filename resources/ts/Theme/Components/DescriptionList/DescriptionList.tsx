import React from 'react';
import {
  chakra,
  forwardRef,
  HTMLChakraProps,
  StylesProvider,
  useMultiStyleConfig,
  useStyles,
} from '@chakra-ui/react';
import { cx } from '@chakra-ui/utils';

export type DescriptionTermProps = HTMLChakraProps<'dt'>;

export const DescriptionTerm = forwardRef<DescriptionTermProps, 'dt'>(
  (props, ref) => {
    const styles = useStyles();
    return (
      <chakra.dt
        ref={ref}
        {...props}
        className={cx('description-list__term', props.className)}
        __css={styles.term}
      />
    );
  }
);

export type DescriptionDetailsProps = HTMLChakraProps<'dd'>;

export const DescriptionDetails = forwardRef<DescriptionDetailsProps, 'dt'>(
  (props, ref) => {
    const styles = useStyles();
    return (
      <chakra.dd
        ref={ref}
        {...props}
        className={cx('description-list__details', props.className)}
        __css={styles.details}
      />
    );
  }
);

export type DescriptionListItemProps = HTMLChakraProps<'div'>;

export const DescriptionListItem = forwardRef<DescriptionListItemProps, 'div'>(
  (props, ref) => {
    const styles = useStyles();
    return (
      <chakra.div
        ref={ref}
        {...props}
        className={cx('description-list__item', props.className)}
        __css={styles.listItem}
      />
    );
  }
);

export type DescriptionListProps = HTMLChakraProps<'dl'>;

export const DescriptionList = forwardRef<DescriptionListProps, 'dl'>(
  (props, ref) => {
    const styles = useMultiStyleConfig('DescriptionList', props);
    const { children } = props;
    return (
      <StylesProvider value={styles}>
        <chakra.dl
          ref={ref}
          {...props}
          className={cx('description-list', props.className)}
          __css={styles.list}
        >
          {children}
        </chakra.dl>
      </StylesProvider>
    );
  }
);
