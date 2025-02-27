import React, {
  ChangeEvent,
  FocusEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
  usePopper,
  VisuallyHidden,
} from '@chakra-ui/react';
import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { useHits, useSearchBox } from 'react-instantsearch-hooks';
import { useDebounce } from 'use-debounce';
import { AlgoliaHit } from 'instantsearch.js';
import SelectFilter from 'src/Theme/Components/SelectFilter';
import SearchResultGroup, {
  HitGroup,
} from 'src/Components/Search/SearchResultGroup';
import { SearchResultDisplayModels } from 'src/Components/Search/SearchResult';

enum SearchInputVariant {
  DEFAULT = 'filled',
  FOCUSED = 'inverted',
}

const hitGroupLabels = Object.values(SearchResultDisplayModels)
  .filter((g) => g != SearchResultDisplayModels.default)
  .map((g) => g.label);

const SearchForm = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { popperRef, referenceRef } = usePopper({
    gutter: 0,
    matchWidth: true,
    placement: 'bottom',
    eventListeners: {
      resize: true,
    },
  });

  const [value, setValue] = useState<string>('');
  const [debouncedValue] = useDebounce(value, 300);
  const { query, refine, clear, isSearchStalled } = useSearchBox();
  const { hits } = useHits({ escapeHTML: false }) as { hits: AlgoliaHit[] };
  const [groupFilter, setGroupFilter] = useState<string>('');
  const [hasFocus, setHasFocus] = useState<boolean>(false);

  // group the search results by label
  const hitGroups = useMemo(() => {
    const hitGroups: HitGroup[] = [];
    for (const hit of hits) {
      const model =
        SearchResultDisplayModels[hit._type] ||
        SearchResultDisplayModels.default;
      let group = hitGroups.find((g) => g.label === model.label);
      if (!group) {
        group = new HitGroup(model.label);
        hitGroups.push(group);
      }
      group.hits.push(hit);
    }
    return hitGroups;
  }, [hits]);

  // filter the search results
  const filteredHitGroups = useMemo(() => {
    return groupFilter
      ? hitGroups.filter((g) => g.label == groupFilter)
      : hitGroups;
  }, [hitGroups, groupFilter]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onInputFocus = () => {
    setHasFocus(true);
  };

  const onContainerBlur: FocusEventHandler = (event) => {
    if (!containerRef.current?.contains(event.relatedTarget)) {
      setHasFocus(false);
    }
  };

  const onClearButtonClick = () => {
    clear();
    setValue('');
    setGroupFilter('');
    inputRef.current?.focus();
  };

  // Algolia hasn't made the query variable part of React state, so we have to trigger the refine operation as a side-effect
  useEffect(() => {
    if (query !== debouncedValue) {
      refine(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, refine]);

  // close the menu when the user clicks on a result
  const onResultClick = () => setHasFocus(false);

  return (
    <Box ref={containerRef} onBlur={onContainerBlur}>
      <form onSubmit={(e) => e.preventDefault()}>
        <FormControl isDisabled={isSearchStalled}>
          <VisuallyHidden>
            <FormLabel htmlFor={'search'}>Search</FormLabel>
          </VisuallyHidden>
          <InputGroup
            ref={referenceRef}
            variant={
              hasFocus ? SearchInputVariant.FOCUSED : SearchInputVariant.DEFAULT
            }
          >
            <InputLeftElement pointerEvents={'none'} aria-hidden={'true'}>
              {isSearchStalled ? (
                <Spinner />
              ) : (
                <SearchIcon color={'gray.400'} />
              )}
            </InputLeftElement>
            <Input
              colorScheme={'primary'}
              backgroundColor={hasFocus ? 'undefined' : 'body.50'}
              id={'search'}
              type={'text'}
              placeholder={'Search'}
              ref={inputRef}
              value={value}
              onChange={onInputChange}
              onFocus={onInputFocus}
              borderBottomRadius={hasFocus && query !== '' ? 'none' : 'md'}
              _focus={{
                borderColor: 'primary.900',
              }}
            />
            {value.length > 0 && (
              <InputRightElement>
                <IconButton
                  colorScheme={hasFocus ? 'whiteAlpha' : 'gray'}
                  variant={'ghost'}
                  size={'sm'}
                  aria-label={'Clear search'}
                  icon={<CloseIcon />}
                  onClick={onClearButtonClick}
                />
              </InputRightElement>
            )}
          </InputGroup>
        </FormControl>
      </form>
      <Box
        visibility={
          query !== '' && value !== '' && hasFocus ? 'visible' : 'hidden'
        }
        ref={popperRef}
        bgColor={'primary.900'}
        color={'gray.50'}
        borderBottomRadius={'md'}
        overflow={'hidden'}
        px={3}
        pb={3}
        border={'1px solid'}
        borderColor={'primary.900'}
        borderTopColor={'gray.100'}
        zIndex={'1000'}
      >
        <Box color={'primary.50'} p={2}>
          <Flex alignItems={'baseline'}>
            <Box flexGrow={1}>SEARCH RESULTS</Box>
            <Flex alignItems={'baseline'}>
              <Box>Include:</Box>
              <SelectFilter
                p={0}
                color={'primary.50'}
                border={0}
                value={groupFilter}
                data-testid="search-filter-option"
                onChange={(e) => setGroupFilter(e.target.value)}
              >
                <option value="">everything</option>
                {hitGroupLabels.map((label) => (
                  <option key={label}>{label}</option>
                ))}
              </SelectFilter>
            </Flex>
          </Flex>
        </Box>
        <Box maxH={600} overflowY={'auto'} data-testid="search-results">
          {filteredHitGroups.length == 0 ? (
            <Text p={3}>No results found, please expand your search</Text>
          ) : (
            filteredHitGroups.map((hitGroup) => (
              <SearchResultGroup
                key={hitGroup.label}
                hitGroup={hitGroup}
                onResultClick={onResultClick}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchForm;
