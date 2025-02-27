import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Tag,
  Menu,
  MenuOptionGroup,
  MenuItemOption,
  MenuList,
  MenuButton,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface MultiSelectProps {
  name: string;
  items: [string, string][];
  onChange: (value: string[]) => void;
  selectedOptions?: string[];
  width?: string;
}

const MultiSelect = ({
  name,
  items,
  onChange,
  selectedOptions = [],
  width,
}: MultiSelectProps) => {
  const itemsKey = items.map(([key]) => key);
  // clean the selectedOptions making sure that the values are correct
  const updatedSelectedOptions = selectedOptions?.filter((option) =>
    itemsKey.includes(option)
  );

  const [valuesSelected, setValuesSelected] = useState(updatedSelectedOptions);

  const onMenuOptionChange = (value: string | string[]) => {
    const values = typeof value === 'string' ? [value] : value;
    setValuesSelected(values);
    onChange(values);
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        variant="outline"
        color="gray.700"
        rightIcon={<ChevronDownIcon />}
        fontWeight={600}
        w={width || '100%'}
        textTransform="capitalize"
        mx={1}
        textAlign="left"
        _hover={{}}
      >
        {name}
        {valuesSelected?.length > 0 && (
          <Tag ml={1}>{valuesSelected.length}</Tag>
        )}
      </MenuButton>
      <MenuList minWidth="240px">
        <MenuOptionGroup
          type="checkbox"
          onChange={onMenuOptionChange}
          defaultValue={valuesSelected}
        >
          {items.map(([key, value]) => (
            <MenuItemOption
              value={key}
              key={key}
              textTransform="capitalize"
              icon={
                <Checkbox
                  aria-hidden="true"
                  tabIndex={-1}
                  isChecked={valuesSelected.includes(key)}
                  isReadOnly
                  mr="2"
                  pointerEvents="none"
                />
              }
            >
              {value}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default MultiSelect;
