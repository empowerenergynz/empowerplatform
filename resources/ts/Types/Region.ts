import { Factory } from 'fishery';
import faker from '@faker-js/faker';

export interface Region {
  id: number;
  name: string;
  districts?: District[];
}

export interface District {
  id: number;
  name: string;
}

export const DistrictFactory = Factory.define<District>(() => {
  return {
    id: faker.datatype.number(),
    name: faker.address.county(),
  };
});

export const RegionFactory = Factory.define<Region>(() => {
  return {
    id: faker.datatype.number(),
    name: faker.address.county(),
    districts: DistrictFactory.buildList(2),
  };
});
