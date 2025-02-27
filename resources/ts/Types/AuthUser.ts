import { Factory } from 'fishery';
import faker from '@faker-js/faker';

export interface AuthUser {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  permissions: string[];
}

export const AuthUserFactory = Factory.define<AuthUser>(() => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  return {
    id: faker.datatype.number(),
    first_name: firstName,
    last_name: lastName,
    name: firstName + ' ' + lastName,
    email: faker.internet.email(),
    permissions: [],
  };
});
