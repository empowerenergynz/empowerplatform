import useIsChildOfCurrentUrl from 'src/Hooks/useIsChildOfCurrentUrl';
import { usePage } from '@inertiajs/inertia-react';
import { renderHook } from '@testing-library/react';

jest.mock('@inertiajs/inertia-react');

describe('The Is Child Of Current Url hook', () => {
  it('can detect if an url is a child of the current one', () => {
    const testCases = [
      {
        currentUrl: '/',
        url: '/',
        expected: true,
      },
      {
        currentUrl: '/',
        url: '/assets',
        expected: false,
      },
      {
        currentUrl: '/assets/foo',
        url: '/assets',
        expected: true,
      },
    ];

    const mockUsePage = usePage as jest.Mock;
    testCases.forEach((testCase) => {
      mockUsePage.mockImplementationOnce(() => {
        return {
          url: testCase.currentUrl,
        };
      });
      const { result } = renderHook(() => useIsChildOfCurrentUrl(testCase.url));
      expect(result.current).toEqual(testCase.expected);
    });
  });
});
