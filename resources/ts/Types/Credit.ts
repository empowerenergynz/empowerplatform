import { Factory } from 'fishery';
import faker from '@faker-js/faker';
import { District, Region } from 'src/Types/Region';
import { Retailer } from 'src/Types/Retailer';
import { User } from 'src/Types/User';
import { Agency } from 'src/Types/Agency';

export interface Credit {
  id: number;
  name: string;
  account: string;
  icp: string;
  amount: number;
  notes: string | null;
  admin_notes: string | null;
  status: CreditStatus;

  retailer_id: number;
  retailer?: Retailer;
  region_id: number;
  region?: Region;
  district_id: number;
  district?: District;
  agency_id: number;
  agency?: Agency;
  created_at?: string;
  created_by_id: number;
  created_by?: User;
  exported_date: string | null;
  exported_by_id: number | null;
  exported_by?: User;
  paid_date: string | null;
  paid_by_id: number | null;
  paid_by?: User;

  deleted_at: string | null;
}

export enum CreditStatus {
  REQUESTED = 0,
  EXPORTED,
  PAID,
  REJECTED,
}

export const CREDIT_STATUS_LABELS = [
  'Requested',
  'Exported',
  'Paid',
  'Rejected',
];

let uniqueId = 1;

export const CreditFactory = Factory.define<Credit>(() => {
  return {
    id: uniqueId++,
    name: faker.name.firstName() + ' ' + faker.name.lastName(),
    account: faker.random.numeric(8).toString(),
    icp: faker.random.alphaNumeric(15).toUpperCase(),
    amount: faker.datatype.number({ min: 1, max: 5 }) * 100,
    notes: '',
    admin_notes: null,
    status: CreditStatus.REQUESTED,
    retailer_id: 0,
    region_id: 0,
    district_id: 0,
    agency_id: 0,
    created_by_id: 0,
    exported_date: null,
    exported_by_id: 0,
    paid_date: null,
    paid_by_id: 0,
    deleted_at: null,
    created_at: new Date().toISOString(),
  };
});
