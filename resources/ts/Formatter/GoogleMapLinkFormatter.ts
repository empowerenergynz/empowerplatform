export const getMapLinkFromAddress = (address: string | null) => {
  return address
    ? `https://www.google.com/maps/search/${address.replace(/\s+/g, '+')}`
    : '';
};

export const getMapLinkFromCoordinates = (coordinates: string | null) => {
  return coordinates ? `https://www.google.com/maps/search/${coordinates}` : '';
};

export const getMapLink = (
  coordinates: string | null,
  address: string | null
) => {
  if (coordinates) {
    getMapLinkFromCoordinates(coordinates);
  }

  return getMapLinkFromAddress(address);
};
