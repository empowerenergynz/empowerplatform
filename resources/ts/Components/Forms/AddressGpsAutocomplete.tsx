import React from 'react';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-google-places-autocomplete';
import { useToast } from '@chakra-ui/react';

interface AddressGpsAutocompleteProps {
  label: string;
  address: string;
  setData: (newAddress: string, gps_coordinates: string) => void;
  required?: boolean;
  isInvalid?: boolean;
  isClearable?: boolean;
}

const AddressGpsAutocomplete = ({
  label,
  address,
  setData,
  required = false,
  isInvalid = false,
  isClearable = false,
}: AddressGpsAutocompleteProps) => {
  const toast = useToast({
    status: 'error',
    duration: 4000,
    isClosable: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onAddressChange = async (response: any) => {
    if (response) {
      try {
        const results = await geocodeByAddress(response.label);
        const { lat, lng } = await getLatLng(results[0]);
        setData(response.label, `${lat},${lng}`);
      } catch (err) {
        toast({ title: 'Unable to find the coordinates.' });
      }
    } else {
      setData('', '');
    }
  };

  // need to pass initial address as value not placeholder so it has correct colour
  const value = {
    label: address,
    value: {},
  };

  // https://react-select.com/styles#style-object
  const styles = {
    control: (styles: object) => ({
      ...styles,
      borderColor: 'grey.200',
      fontSize: 'medium',
    }),
  };

  return (
    <GooglePlacesAutocomplete
      apiKey={process.env.MIX_GOOGLEPLACES_API_KEY}
      selectProps={{
        inputId: label,
        value,
        styles,
        required,
        isClearable,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'aria-invalid': isInvalid,
        onChange: onAddressChange,
      }}
      debounce={300}
      onLoadFailed={(error) => {
        toast({ title: 'Unable to connect to Google Places service' });
        console.error('Unable to connect to Google Places service', error);
      }}
    />
  );
};

export default AddressGpsAutocomplete;
