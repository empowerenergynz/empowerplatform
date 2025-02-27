import {
  Box,
  Icon,
  IconButton,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import {
  AutoComplete as ChakraAutoComplete,
  AutoCompleteGroup,
  AutoCompleteGroupTitle,
  AutoCompleteInput,
  AutoCompleteInputProps,
  AutoCompleteItem,
  AutoCompleteList,
  Item,
  UseAutoCompleteProps,
} from '@choc-ui/chakra-autocomplete';
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons';
import React, { useMemo, useRef, useState } from 'react';

// Native AutoComplete component doesn't provide UI to clear the input
// So add our own 'X' button using CSS absolute positioning and call the API
// Providing the placeholder as a separate prop instead of default value makes this easier

export interface AutoCompleteOption {
  value: string;
  label: string;
  groups?: string[];
}

// we add our own lower-case copy of the label + group for quick custom filter including group name.
type SearchableOption = AutoCompleteOption & {
  searchable: string;
};

interface Group {
  label: string;
  options: SearchableOption[];
}

interface AutoCompleteProps extends Omit<AutoCompleteInputProps, 'onChange'> {
  options: AutoCompleteOption[];
  onChange: (value: string, item: Item | Item[]) => void;
  value?: string;
  readOnly?: boolean;
  suggestWhenEmpty?: boolean;
  showClear?: boolean;
  placeholder?: string;
  noGroupLabel?: string;
  selectGroupSuffix?: string;
}

const AutoComplete = ({
  options,
  onChange,
  value,
  readOnly,
  suggestWhenEmpty,
  showClear,
  placeholder,
  noGroupLabel,
  selectGroupSuffix,
  ...rest
}: AutoCompleteProps) => {
  const inputEl = useRef<HTMLInputElement>(null);

  // fire a focus event when clicking on the right element
  // (ChackraAutoComplete does not come with a function to open the select box)
  const onClickOnIcon = () => {
    inputEl.current?.focus();
  };

  // the AutoComplete component doesn't actually clear the placeholder so re-render it
  // https://github.com/anubra266/choc-autocomplete/issues/64#issuecomment-911880101
  const [reRenderKey, setReRenderKey] = useState<number>(0);
  const onClearClick = () => {
    onChange('', []);
    setReRenderKey(reRenderKey + 1);
  };

  // if the options are grouped we also want to search the group name, so we need a custom filter function
  // which needs quick access to the lower case "label + group"
  // also sort the options
  const searchableOptions = useMemo<SearchableOption[]>(() => {
    return options
      .map<SearchableOption>((option) => ({
        ...option,
        searchable: [
          option.label.toLowerCase(),
          ...(option.groups || []).map((group) => group.toLowerCase()),
        ].join('~~'),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [options]);

  // split the options into groups - do this with useMemo()
  const groups = useMemo<Group[]>(() => {
    const groups: Group[] = [];
    const defaultGroup: Group = { label: noGroupLabel || '', options: [] };

    for (const option of searchableOptions) {
      const groupLabels = option.groups?.length
        ? option.groups
        : [defaultGroup.label];

      for (const labelOrBlank of groupLabels) {
        const label = labelOrBlank || defaultGroup.label;
        let group =
          label === defaultGroup.label
            ? defaultGroup
            : groups.find((g) => g.label === label);
        if (!group) {
          group = { label, options: [] };
          groups.push(group);
        }
        group.options.push(option);
      }
    }

    // sort the groups by label
    groups.sort((a, b) => a.label.localeCompare(b.label));

    // add the 'Select All' options at the top of each group
    if (selectGroupSuffix) {
      for (const group of groups) {
        group.options.unshift({
          // add 'group-' to query jobs by team.name
          value: 'group-' + group.label,
          label: group.label + selectGroupSuffix,
          searchable: group.label.toLowerCase(),
          groups: [group.label],
        });
      }
    }

    // always put the default group first
    if (defaultGroup.options.length) {
      groups.unshift(defaultGroup);
    }

    return groups;
  }, [noGroupLabel, selectGroupSuffix, searchableOptions]);

  // append the "All Group" options to the searchableOptions
  const allSearchableOptions = useMemo<SearchableOption[]>(() => {
    const all: SearchableOption[] = [];
    groups.forEach((g) => all.push(...g.options));
    return all;
  }, [groups]);

  // filter function allows partial matches of each word
  // e.g. "Big Tractor" owned by "Acme Ltd" could be found by searching for "ac trac"
  const filterFn: UseAutoCompleteProps['filter'] = (filter, value) => {
    const option = allSearchableOptions.find((o) => o.value === value);
    const searchWords = filter.toLowerCase().split(' ');
    return searchWords.every(
      (word) => option?.searchable.includes(word) || false
    );
  };

  return (
    <ChakraAutoComplete
      openOnFocus
      suggestWhenEmpty={suggestWhenEmpty}
      onChange={onChange}
      key={reRenderKey}
      restoreOnBlurIfEmpty={false}
      isReadOnly={readOnly}
      filter={filterFn}
    >
      {({ isOpen }) => (
        <Box style={{ position: 'relative' }}>
          <InputGroup>
            <AutoCompleteInput
              variant="outline"
              autoComplete="off"
              placeholder={value || placeholder}
              ref={inputEl}
              {...rest}
              onChange={(event) => {
                if (!event.target.value) {
                  onChange('', []);
                }
              }}
            />
            <InputRightElement
              onClick={onClickOnIcon}
              children={
                <Icon
                  w={5}
                  h={5}
                  as={isOpen ? ChevronUpIcon : ChevronDownIcon}
                />
              }
            />
          </InputGroup>
          {showClear && value ? (
            <IconButton
              variant={'unstyled'}
              icon={<CloseIcon />}
              onClick={() => onClearClick()}
              aria-label="Clear"
              size="xs"
              style={{
                position: 'absolute',
                right: '30px',
                top: '6px',
                zIndex: 1,
              }}
            >
              Clear
            </IconButton>
          ) : (
            ''
          )}
          <AutoCompleteList>
            {groups.map((group) => (
              <AutoCompleteGroup key={group.label || '_default'} showDivider>
                {
                  /* https://github.com/anubra266/choc-autocomplete/issues/146#issuecomment-1145076432 */
                  [group.label, ...group.options]
                    .filter((a) => a)
                    .map((option) =>
                      typeof option === 'string' ? (
                        <AutoCompleteGroupTitle key="_title" ml={2}>
                          {group.label.toUpperCase()}
                        </AutoCompleteGroupTitle>
                      ) : (
                        <AutoCompleteItem
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          pl={group.label ? 5 : undefined}
                        >
                          {option.label}
                        </AutoCompleteItem>
                      )
                    )
                }
              </AutoCompleteGroup>
            ))}
          </AutoCompleteList>
        </Box>
      )}
    </ChakraAutoComplete>
  );
};

export default AutoComplete;
