import React from 'react';
import { default as ReactPhoneNumberInput } from 'react-phone-number-input';
import { Input } from '@chakra-ui/react';

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput = ({ value, onChange }: PhoneNumberInputProps) => (
  <Input
    as={ReactPhoneNumberInput}
    aria-label="Phone number"
    defaultCountry="NZ"
    value={value}
    onChange={(value) => onChange(value ? value.toString() : '')}
    name="phone_number"
    variant="outline"
  />
);

export default PhoneInput;
