import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger as OrigPopoverTrigger,
  VStack,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { Role } from 'src/Types/User';

interface RolesPickerProps {
  roles: Role[];
  selectedRoles: Role[];
  onChange?: (value: Role[]) => void;
  errors?: string;
  readonly?: boolean;
  exclusiveRole?: Role;
  disabledRoles?: Role[];
  // don't think Users will ever need multiple roles in this project, so let this default to false
  multiple?: boolean;
}

// react 18 type work-around: https://github.com/chakra-ui/chakra-ui/issues/5896#issuecomment-1104085557
export const PopoverTrigger: React.FC<{ children: React.ReactNode }> =
  OrigPopoverTrigger;

const RolesPicker = ({
  roles,
  selectedRoles,
  onChange,
  errors,
  readonly = false,
  exclusiveRole,
  disabledRoles,
  multiple,
}: RolesPickerProps) => {
  return (
    <FormControl isInvalid={!!errors} isRequired>
      <FormLabel htmlFor="roles">Roles</FormLabel>
      <Popover placement="top-start">
        <PopoverTrigger>
          <Button
            w="100%"
            borderWidth="1px"
            borderColor="#A7ACB1"
            backgroundColor="white"
            fontWeight="normal"
            data-testid="select-roles"
            textTransform={
              selectedRoles.length === 1 ? 'capitalize' : undefined
            }
          >
            {selectedRoles.length === 0 && 'Select Role(s)'}
            {selectedRoles.length === 1 &&
              roles.find((r) => r.id === selectedRoles[0].id)?.name}
            {selectedRoles.length > 1 &&
              `Multiple (${selectedRoles.length}) roles`}
          </Button>
        </PopoverTrigger>
        <PopoverContent backgroundColor="white" borderColor="#A7ACB1">
          <PopoverArrow bg="#A7ACB1" />
          <PopoverCloseButton />
          <PopoverHeader>Roles</PopoverHeader>
          <PopoverBody data-testid="checkbox-group">
            <FormControl isInvalid={!!errors} isRequired={true}>
              <CheckboxGroup
                value={selectedRoles.map((r) => r.id)}
                onChange={(value) => {
                  // don't think Users will ever need multiple roles in this project
                  // so if more than one role only keep the last one selected
                  if (!multiple && value.length > 1) {
                    // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-non-null-assertion
                    value = [value.pop()!];
                  }
                  onChange?.(roles.filter((role) => value.includes(role.id)));
                }}
              >
                <VStack spacing={2} alignItems="start">
                  {roles.map((role) => {
                    /*  selected and exclusiveRole logic :
                        If exclusive role(customer) is a part of the selectedRole then the rest of the roles is disabled.
                        If exclusive role is not a part of the selectedRole, then the user can select any number of roles from the list (except the customer role).
                    */
                    let roleIsReadOnly = false;
                    if (selectedRoles.length > 0) {
                      if (
                        exclusiveRole?.id === role.id &&
                        !selectedRoles.find(
                          (sRole: Role) => sRole.id === role.id
                        )
                      ) {
                        roleIsReadOnly = true;
                      } else if (
                        exclusiveRole?.id !== role.id &&
                        selectedRoles.find(
                          (sRole: Role) => sRole.id === exclusiveRole?.id
                        )
                      ) {
                        roleIsReadOnly = true;
                      }
                    }
                    if (disabledRoles && disabledRoles.length > 0) {
                      if (
                        disabledRoles.find(
                          (sRole: Role) => sRole.id === role.id
                        )
                      ) {
                        roleIsReadOnly = true;
                      }
                    }

                    return (
                      <Checkbox
                        data-testid={`checkboxRolePick-${role.id}`}
                        key={role.id}
                        value={role.id}
                        readOnly={roleIsReadOnly || readonly}
                        isDisabled={roleIsReadOnly}
                      >
                        <Text fontWeight="bold" textTransform="capitalize">
                          {role.name}
                        </Text>
                        <Text color="gray.700">{role.description}</Text>
                      </Checkbox>
                    );
                  })}
                </VStack>
              </CheckboxGroup>
            </FormControl>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <FormErrorMessage>{errors}</FormErrorMessage>
    </FormControl>
  );
};

export default RolesPicker;
