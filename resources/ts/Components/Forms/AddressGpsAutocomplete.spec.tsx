import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import GooglePlacesAutocompleteProps from 'react-google-places-autocomplete/build/GooglePlacesAutocomplete.types';
import AddressGpsAutocomplete from 'src/Components/Forms/AddressGpsAutocomplete';
import { useToast } from '@chakra-ui/react';

jest.mock('react-google-places-autocomplete', () => ({
  __esModule: true, //eslint-disable-line @typescript-eslint/naming-convention
  geocodeByAddress: jest.fn(),
  getLatLng: jest.fn(),
  default: (props: GooglePlacesAutocompleteProps) => {
    const { selectProps, onLoadFailed } = props;

    const onLoadFail = () => {
      if (onLoadFailed) onLoadFailed(new Error());
    };

    const onSuccess = () => {
      selectProps && selectProps.onChange
        ? selectProps.onChange(
            {
              label: '776 6th Avenue, New York, NY, USA',
              value: {
                description: '776 6th Avenue, New York, NY, USA',
                matched_substrings: [
                  {
                    length: 3,
                    offset: 0,
                  },
                ],
                place_id: 'ChIJc4ld-aRZwokREu8dZYsqE5o',
                reference: 'ChIJc4ld-aRZwokREu8dZYsqE5o',
                structured_formatting: {
                  main_text: '776 6th Avenue',
                  main_text_matched_substrings: [
                    {
                      length: 3,
                      offset: 0,
                    },
                  ],
                  secondary_text: 'New York, NY, USA',
                },
                terms: [
                  {
                    offset: 0,
                    value: '776',
                  },
                  {
                    offset: 4,
                    value: '6th Avenue',
                  },
                  {
                    offset: 16,
                    value: 'New York',
                  },
                  {
                    offset: 26,
                    value: 'NY',
                  },
                  {
                    offset: 30,
                    value: 'USA',
                  },
                ],
                types: ['street_address', 'geocode'],
              },
            },
            { action: 'create-option', option: {} }
          )
        : {};
    };

    return (
      <div>
        <input
          type={'text'}
          value={selectProps ? selectProps.value.label : ''}
        />
        <button type={'button'} onClick={onSuccess}>
          Success
        </button>

        <button type={'button'} onClick={onLoadFail}>
          OnLoadFail
        </button>
      </div>
    );
  },
}));
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: jest.fn(),
}));

// Disable error messages in tests
jest.spyOn(console, 'error').mockImplementation(jest.fn());

describe('The Google Places input component', () => {
  beforeEach(() => {
    const mockGeocodeByAddress = geocodeByAddress as jest.Mock;
    mockGeocodeByAddress.mockImplementation(async () => {
      return [
        {
          address_components: [
            {
              long_name: '1233',
              short_name: '1233',
              types: ['street_number'],
            },
            {
              long_name: 'York Avenue',
              short_name: 'York Ave',
              types: ['route'],
            },
            {
              long_name: 'Manhattan',
              short_name: 'Manhattan',
              types: ['political', 'sublocality', 'sublocality_level_1'],
            },
            {
              long_name: 'New York',
              short_name: 'New York',
              types: ['locality', 'political'],
            },
            {
              long_name: 'New York County',
              short_name: 'New York County',
              types: ['administrative_area_level_2', 'political'],
            },
            {
              long_name: 'New York',
              short_name: 'NY',
              types: ['administrative_area_level_1', 'political'],
            },
            {
              long_name: 'United States',
              short_name: 'US',
              types: ['country', 'political'],
            },
            {
              long_name: '10065',
              short_name: '10065',
              types: ['postal_code'],
            },
          ],
          formatted_address: '1233 York Ave, New York, NY 10065, USA',
          geometry: {
            location: {},
            location_type: 'ROOFTOP',
          },
          place_id: 'ChIJ1_GF_cJYwokR8u455JHGkBA',
          plus_code: {
            compound_code: 'Q27V+98 New York, NY, USA',
            global_code: '87G8Q27V+98',
          },
          types: ['street_address'],
        },
      ];
    });

    const mockGetLatLng = getLatLng as jest.Mock;
    mockGetLatLng.mockImplementation(() => {
      return { lat: -123, lng: -123 };
    });
  });

  it('should call setData with the address and the gps coordinates', async function () {
    const setData = jest.fn();
    render(
      <AddressGpsAutocomplete
        label={'address'}
        address={'test address'}
        setData={setData}
      />
    );

    const successButton = screen.getByRole('button', { name: 'Success' });
    await userEvent.click(successButton);

    await waitFor(() => {
      expect(setData).toHaveBeenCalledWith(
        '776 6th Avenue, New York, NY, USA',
        `${-123},${-123}`
      );
    });
  });

  it('should pass the address as a placeholder to the Google Places component', async () => {
    const setData = jest.fn();
    render(
      <AddressGpsAutocomplete
        label={'address'}
        address={'test address'}
        setData={setData}
      />
    );
    await screen.findByDisplayValue('test address');
  });

  it('should render a toast message to the user when geocoding fails', async () => {
    const toast = jest.fn();

    const mockUseToast = useToast as jest.Mock;
    mockUseToast.mockImplementation(() => toast);

    const mockGetLatLng = getLatLng as jest.Mock;
    mockGetLatLng.mockImplementation(() => {
      throw new Error();
    });

    render(
      <AddressGpsAutocomplete
        label={'address'}
        address={'test address'}
        setData={jest.fn()}
      />
    );

    const successButton = screen.getByRole('button', { name: 'Success' });
    await userEvent.click(successButton);

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Unable to find the coordinates.' })
      )
    );
  });

  it('should render a toast message to the user when unable to connect to Google Places API', async () => {
    const toast = jest.fn();

    const mockUseToast = useToast as jest.Mock;
    mockUseToast.mockImplementation(() => toast);

    render(
      <AddressGpsAutocomplete
        label={'address'}
        address={'test address'}
        setData={jest.fn()}
      />
    );

    const onLoadFailButton = screen.getByRole('button', { name: 'OnLoadFail' });
    await userEvent.click(onLoadFailButton);

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Unable to connect to Google Places service',
        })
      )
    );
  });
});
