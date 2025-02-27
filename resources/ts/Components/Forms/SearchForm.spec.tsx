/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { useSearchBox, useHits } from 'react-instantsearch-hooks';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from 'src/Components/Forms/SearchForm';
import { SearchResultHitFactory } from 'src/Types/SearchResult';
import { InertiaLinkProps } from '@inertiajs/inertia-react';

jest.mock('react-instantsearch-hooks');

jest.mock('@inertiajs/inertia-react', () => ({
  ...jest.requireActual('@inertiajs/inertia-react'),
  usePage: jest.fn(() => ({
    props: {},
  })),
  InertiaLink: ({ href, children }: InertiaLinkProps) => (
    <a className="chakra-link" data-group="true" data-href={href}>
      {children}
    </a>
  ),
}));

describe('The search form', () => {
  afterAll(() => jest.clearAllMocks());

  it('refines the search query when the input changes', async () => {
    const refine = jest.fn();
    const mockUseSearchBox = useSearchBox as jest.Mock;
    mockUseSearchBox.mockImplementation(() => ({
      query: '',
      refine,
      isSearchStalled: false,
      clear: jest.fn(),
    }));

    const mockUseHits = useHits as jest.Mock;
    mockUseHits.mockImplementation(() => ({ hits: [] }));

    render(<SearchForm />);

    await userEvent.type(screen.getByRole('textbox'), 'test');

    await waitFor(() => {
      expect(refine).toHaveBeenCalledWith('test');
    });
  });

  it('clears the search query and filter, resets the input value and focuses the input when the clear button is clicked', async () => {
    const clear = jest.fn();
    const mockUseSearchBox = useSearchBox as jest.Mock;
    mockUseSearchBox.mockImplementation(() => ({
      query: 'test',
      refine: jest.fn(),
      isSearchStalled: false,
      clear,
    }));

    const mockUseHits = useHits as jest.Mock;
    mockUseHits.mockImplementation(() => ({ hits: [] }));

    render(<SearchForm />);

    // enter some search text
    await userEvent.type(screen.getByRole('textbox'), 'test');

    // also select a search filter
    const searchFilter = screen.getByTestId('search-filter-option');
    await userEvent.selectOptions(searchFilter, 'Users');

    // test the search text and filter
    expect(await screen.getByRole('textbox')).toHaveValue('test');
    expect(searchFilter).toHaveValue('Users');

    // clear the search
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));

    await waitFor(() => {
      expect(clear).toHaveBeenCalled();
    });

    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('textbox')).toHaveFocus();

    // test the filter has been cleared
    expect(searchFilter).toHaveValue('');
  });

  it('shows a loading spinner when the search query is stalled', () => {
    const mockUseSearchBox = useSearchBox as jest.Mock;
    mockUseSearchBox.mockImplementation(() => ({
      query: '',
      refine: jest.fn(),
      isSearchStalled: true,
      clear: jest.fn(),
    }));

    const mockUseHits = useHits as jest.Mock;
    mockUseHits.mockImplementation(() => ({ hits: [] }));

    render(<SearchForm />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('does not render the hits when the query is empty', async () => {
    const mockUseSearchBox = useSearchBox as jest.Mock;
    mockUseSearchBox.mockImplementation(() => ({
      query: '',
      refine: jest.fn(),
      isSearchStalled: false,
      clear: jest.fn(),
    }));

    const mockUseHits = useHits as jest.Mock;
    mockUseHits.mockImplementation(() => ({
      hits: SearchResultHitFactory.buildList(3),
    }));

    render(<SearchForm />);

    await userEvent.click(screen.getByRole('textbox'));

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders the hits when the query is not empty and closes them when clicked', async () => {
    const mockUseSearchBox = useSearchBox as jest.Mock;
    mockUseSearchBox.mockImplementation(() => ({
      query: 'test',
      refine: jest.fn(),
      isSearchStalled: false,
      clear: jest.fn(),
    }));

    const mockUseHits = useHits as jest.Mock;
    mockUseHits.mockImplementation(() => ({
      hits: SearchResultHitFactory.buildList(3),
    }));

    render(<SearchForm />);

    await userEvent.click(screen.getByRole('textbox'));

    const results = screen.getByTestId('search-results');
    const links = results.querySelectorAll('a');
    expect(links).toHaveLength(3);

    // check the list closes when clicked
    await userEvent.click(links[0]);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('renders the result type filter which filters the result when selected', async () => {
    const mockUseSearchBox = useSearchBox as jest.Mock;
    mockUseSearchBox.mockImplementation(() => ({
      query: 'test',
      refine: jest.fn(),
      isSearchStalled: false,
      clear: jest.fn(),
    }));

    const mockUseHits = useHits as jest.Mock;
    mockUseHits.mockImplementation(() => ({
      hits: [
        SearchResultHitFactory.build({ _type: 'user' }),
        SearchResultHitFactory.build({ _type: 'donation' }),
      ],
    }));

    render(<SearchForm />);
    expect(screen.getByText('Include:')).toBeInTheDocument();

    // filter options
    expect(screen.queryAllByText('Users')).toHaveLength(1);
    expect(screen.queryAllByText('Donations')).toHaveLength(1);

    // group headings
    expect(screen.queryAllByText('USERS')).toHaveLength(1);
    expect(screen.queryAllByText('DONATIONS')).toHaveLength(1);

    // results
    const results = screen.getByTestId('search-results');
    let links = results.querySelectorAll('a');
    expect(links).toHaveLength(2);

    // select a filter
    await userEvent.selectOptions(
      screen.getByTestId('search-filter-option'),
      'Users'
    );
    expect(screen.queryAllByText('USERS')).toHaveLength(1);
    expect(screen.queryAllByText('DONATIONS')).toHaveLength(0);
    links = results.querySelectorAll('a');
    expect(links).toHaveLength(1);
  });
});
