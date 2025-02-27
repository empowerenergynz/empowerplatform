import React, { ChangeEvent, useMemo } from 'react';
import { default as ReactPhoneNumberInput } from 'react-phone-number-input';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  Select,
  SelectProps,
  Textarea,
} from '@chakra-ui/react';
import useExtractProps, { MARGIN_PROPS } from 'src/Hooks/useExtractProps';

const isDateOrTimeRegEx = /date|time/;

// can provide either setData or onChange (if you want to handle it yourself)

interface FormInputWithLabelProps<T> extends Omit<InputProps, 'name'> {
  label: string;
  name: keyof T;
  data: T;
  type?:
    | 'text'
    | 'email'
    | 'phone'
    | 'textarea'
    | 'select'
    | 'number'
    | 'date'
    | 'time'
    | 'datetime-local'; // default to text
  options?: { id: number | string; name: number | string }[];
  nullOptionLabel?: string;
  onChange?: (e: ChangeEvent<HTMLElement>) => void;
  setData?: (key: keyof T, value: string) => void;
  errors?: Record<keyof T, string>;
  isRequired?: boolean;
  defaultCountry?: string;
  rows?: string | number;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function FormInputWithLabel<T>({
  label,
  name,
  type,
  data,
  options,
  nullOptionLabel,
  onChange,
  setData,
  isRequired,
  errors,
  ...rest
}: FormInputWithLabelProps<T>) {
  // the phone inputs returns a string not the event
  const myOnChange =
    onChange ||
    (setData
      ? (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
          setData(
            name,
            type === 'phone' ? (e || '').toString() : e.target.value.toString()
          )
      : undefined);

  const isInvalidDateTime = !data[name] && type && isDateOrTimeRegEx.test(type);

  // extract the margin props so we can put them on the container
  const { newProps, extractedProps: marginProps } = useExtractProps(
    rest,
    MARGIN_PROPS
  );

  const myRest = useMemo(() => {
    const myRest = { ...newProps };
    if (type === 'phone') {
      myRest.defaultCountry = 'NZ';
      myRest.as = ReactPhoneNumberInput;
    } else if (type === 'textarea') {
      myRest.as = Textarea;
      myRest.rows = myRest.rows
        ? typeof myRest.rows == 'string'
          ? parseInt(myRest.rows)
          : myRest.rows
        : 3;
      // Chakra forces the input height which overrides the rows: https://github.com/chakra-ui/chakra-ui/issues/1428
      myRest.height = 'auto';
    } else if (isInvalidDateTime) {
      // date/time inputs don't use placeholders - instead they use 'virtual DOM' elements
      // which are easiest to style with the color attribute - so fake a placeholder colour if no value
      // https://stackoverflow.com/a/14508957
      myRest.color = 'gray.500';
    }
    return myRest;
  }, [type, isInvalidDateTime]); // eslint-disable-line react-hooks/exhaustive-deps

  // recently LastPass started ignoring the data-lpignore attribute, so this hack changes the input name to prevent
  // it being recognised as a personal form element, eg ('name', 'address', 'email', etc).
  const inputName =
    (name as string) + ('data-lpignore' in rest ? '-ignore-lastpass-hack' : '');

  return (
    <FormControl
      isInvalid={errors && name in errors}
      isRequired={isRequired}
      {...marginProps}
    >
      {label && <FormLabel htmlFor={inputName}>{label}</FormLabel>}
      {type == 'select' ? (
        <Select
          aria-label={label}
          variant="outline"
          id={inputName}
          name={inputName}
          value={data[name] as unknown as string}
          onChange={myOnChange}
          {...(newProps as SelectProps)}
        >
          <option value="">{nullOptionLabel}</option>
          {options?.map((option) => (
            <option value={option.id} key={option.id}>
              {option.name}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          aria-label={label}
          variant="outline"
          id={inputName}
          name={inputName}
          type={type || 'text'}
          value={data[name] as unknown as string}
          onChange={myOnChange}
          {...myRest}
        />
      )}
      <FormErrorMessage>{errors?.[name] || ''}</FormErrorMessage>
    </FormControl>
  );
}

export default FormInputWithLabel;
