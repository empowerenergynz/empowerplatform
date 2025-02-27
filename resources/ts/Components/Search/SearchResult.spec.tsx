/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchResult, {
  SearchResultDisplayModels,
} from 'src/Components/Search/SearchResult';
import { List } from '@chakra-ui/react';
import { SearchResultHitFactory } from 'src/Types/SearchResult';

describe.skip('The search result', () => {
  it('displays the correct link and metadata for user results', () => {
    // first, test we have a search result type defined for this type
    const type = 'user';
    const model = SearchResultDisplayModels[type];
    expect(model).toBeTruthy();

    const hit = SearchResultHitFactory.build({
      _type: type,
      name: 'Test User',
      phone_number: '1234',
      email: 'test@test.com',
    });

    render(
      <List>
        <SearchResult hit={hit} />
      </List>
    );

    const link = screen.queryByRole('link');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('/users/' + hit._id)
    );
    expect(link).toHaveTextContent(hit.name);
    expect(link).toHaveTextContent('TU'); // avatar
    expect(link).toHaveTextContent(hit.phone_number);
    expect(link).toHaveTextContent(hit.email);
  });

  it('displays the correct link and metadata for donation results', () => {
    // first, test we have a search result type defined for this type
    const type = 'donation';
    const model = SearchResultDisplayModels[type];
    expect(model).toBeTruthy();

    const hit = SearchResultHitFactory.build({
      _type: type,
      address: '123 Example Street',
    });

    render(
      <List>
        <SearchResult hit={hit} />
      </List>
    );

    const link = screen.queryByRole('link');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('/donations/' + hit._id)
    );
    expect(link).toHaveTextContent(hit.name);
    expect(link).toHaveTextContent(hit.address);
  });
});
