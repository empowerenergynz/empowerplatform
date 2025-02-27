/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { AlgoliaHit } from 'instantsearch.js';
import { Factory } from 'fishery';
import faker from '@faker-js/faker';

export interface SearchResultHit extends AlgoliaHit {
  objectID: string;
  _type: string;
  _id: number;
  name: string;
}

export const SearchResultHitFactory = Factory.define<SearchResultHit>(
  ({ sequence }) => {
    const name = faker.lorem.word();
    return {
      objectID: faker.datatype.uuid(),
      _type: 'user',
      _id: sequence,
      name,
      _highlightResult: {
        name: {
          value: name,
          matchLevel: 'full',
          matchedWords: [name],
        },
      },
    };
  }
);
