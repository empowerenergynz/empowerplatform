import { Factory } from 'fishery';
import faker from '@faker-js/faker';

export interface Retailer {
  id: number;
  name: string;
  account_name: string;
  account_number: string;
  particulars: string;
  code: string;
  reference: string;
  email: string | null;
}

export const RetailerFactory = Factory.define<Retailer>(() => {
  return {
    id: faker.datatype.number(),
    name: faker.company.companyName(),
    account_name: faker.company.companyName(),
    account_number: faker.datatype.number().toString(),
    particulars: faker.datatype.string(),
    code: faker.datatype.string(),
    reference: faker.datatype.string(),
    email: faker.name.firstName() + '@example.com',
  };
});
