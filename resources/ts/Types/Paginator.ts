import faker from '@faker-js/faker';
import { Factory } from 'fishery';

type Link = {
  url: string | null;
  label: string;
  active: boolean;
};

export type Paginator<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PaginatorFactory = Factory.define<Paginator<any>>(() => ({
  current_page: faker.datatype.number(),
  data: [],
  first_page_url: 'http://localhost?page=1',
  from: faker.datatype.number(),
  last_page: faker.datatype.number(),
  last_page_url: 'http://localhost?page=1',
  links: [],
  next_page_url: 'http://localhost?page=2',
  path: 'http://localhost',
  per_page: faker.datatype.number(),
  prev_page_url: null,
  to: faker.datatype.number(),
  total: faker.datatype.number(),
}));
