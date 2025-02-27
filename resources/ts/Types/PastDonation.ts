import { Factory } from 'fishery';
import faker from '@faker-js/faker';
import { Donation, DonationFactory } from 'src/Types/Donation';

export interface PastDonation {
  id: number;
  icp: string;
  date: string;
  account_number: string;
  amount: string;
  donation?: Donation;
  donation_id?: number;
  retailer?: string;
}

export const PastDonationFactory = Factory.define<PastDonation>(() => ({
  id: faker.datatype.number(),
  icp: faker.random.alphaNumeric(15).toUpperCase(),
  date: faker.date.recent(365).toISOString().split('T')[0],
  account_number: faker.random.numeric(8).toString(),
  amount: faker.finance.amount(5, 100, 2, '', true),
  donation: DonationFactory.build(),
}));
