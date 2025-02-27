import { Factory } from 'fishery';
import faker from '@faker-js/faker';
import { District, Region } from 'src/Types/Region';

export interface Agency {
  id: number;
  name: string;
  balance: number;
  balance_date: string;
  region_id?: number;
  region?: Region;
  district_id?: number;
  district?: District;
  deleted_at: string | null;
}

export const AgencyFactory = Factory.define<Agency>(() => {
  return {
    id: faker.datatype.number(),
    name: faker.company.companyName(),
    balance: faker.datatype.number({ min: 100, max: 20000 }),
    balance_date: new Date().toISOString(),
    deleted_at: null,
  };
});
