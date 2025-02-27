import { Factory } from 'fishery';
import faker from '@faker-js/faker';
import { User } from 'src/Types/User';

export interface Donation {
  id: number;
  address: string;
  gps_coordinates: string;
  icp: string;
  retailer: string;
  account_number: string;
  amount: string;
  is_dollar: boolean;
  buyback_rate: string;
  is_active: boolean;
  user?: User;
  user_id?: number;
}

export const DonationFactory = Factory.define<Donation>(() => {
  const isDollar = faker.datatype.boolean();
  return {
    id: faker.datatype.number(),
    address: faker.address.streetAddress(true),
    gps_coordinates: `${faker.address.latitude()},${faker.address.longitude()}`,
    icp: faker.random.alphaNumeric(15).toUpperCase(),
    retailer: faker.company.companyName(),
    account_number: faker.random.numeric(8).toString(),
    amount: faker.finance.amount(5, 100, 2, '', true),
    is_dollar: isDollar,
    buyback_rate: isDollar ? '0.00' : faker.finance.amount(5, 100, 2, '', true),
    is_active: faker.datatype.boolean(),
  };
});
