import { AlgoliaHit } from 'instantsearch.js';
import { Box, Button, List } from '@chakra-ui/react';
import SearchResult from 'src/Components/Search/SearchResult';
import React, { MouseEventHandler, useEffect, useState } from 'react';

export class HitGroup {
  public hits: AlgoliaHit[] = [];

  constructor(public label: string) {}
}

export interface SearchResultGroupProps {
  hitGroup: HitGroup;
  onResultClick: MouseEventHandler;
}

const SearchResultGroup = ({
  hitGroup,
  onResultClick,
}: SearchResultGroupProps) => {
  const showCountIncrement = 10;

  const [showCount, setShowCount] = useState<number>(showCountIncrement);
  const [moreCount, setMoreCount] = useState<number>(
    hitGroup.hits.length - showCountIncrement
  );

  const onShowMoreClick = () => {
    setShowCount(showCount + showCountIncrement);
  };

  useEffect(() => {
    setMoreCount(hitGroup.hits.length - showCount);
  }, [showCount, hitGroup.hits.length]);

  return (
    <Box key={hitGroup.label} p={3} pb={0}>
      <Box color="primary.50">{hitGroup.label.toUpperCase()}</Box>
      <List variant="unstyled" onClick={onResultClick}>
        {hitGroup.hits.slice(0, showCount).map((hit) => (
          <SearchResult key={hit.objectID} hit={hit} />
        ))}
      </List>
      {moreCount > 0 && (
        <Button
          ml={10}
          color="secondary.600"
          size="sm"
          variant="link"
          onClick={onShowMoreClick}
        >
          Show {Math.min(moreCount, showCountIncrement)} More{' '}
          {moreCount > 1 ? 'results' : 'result'}
        </Button>
      )}
    </Box>
  );
};

export default SearchResultGroup;
