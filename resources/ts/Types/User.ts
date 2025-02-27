import { Factory } from 'fishery';
import faker from '@faker-js/faker';
import { Agency } from 'src/Types/Agency';

export interface Role {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
}

export interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  roles: Role[];
  phone_number: string | null;
  invited_at: string | null;
  last_login_at: string | null;
  deleted_at: string | null;
  reference: string | null;
  agency_id?: number | null;
  agency?: Agency | null;
}
export const UserFactory = Factory.define<User>(() => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  return {
    id: faker.datatype.number(),
    first_name: firstName,
    last_name: lastName,
    name: firstName + ' ' + lastName,
    email: faker.internet.email(),
    phone_number: faker.phone.phoneNumber(),
    roles: [
      {
        id: faker.datatype.string(),
        name: faker.name.jobType(),
        color: faker.internet.color(),
        description: faker.lorem.sentence(),
      },
    ],
    invited_at: faker.date.recent(1).toISOString(),
    last_login_at: faker.date.recent(1).toISOString(),
    deleted_at: null,
    customer: null,
    reference: null,
  };
});

export const ArchivedUserFactory = UserFactory.params({
  deleted_at: faker.date.recent(30).toISOString(),
});

export const RoleFactory = Factory.define<Role>(() => ({
  id: faker.datatype.string(),
  name: faker.name.jobType(),
  color: faker.internet.color(),
  description: faker.lorem.sentence(),
}));

export enum UserRoles {
  SUPER_ADMIN = 'super admin',
  ADMIN = 'admin',
  DONOR = 'donor',
  AGENCY_ADMIN = 'agency admin',
  AGENCY_USER = 'agency user',
}
