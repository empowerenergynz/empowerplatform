import { AuthUserFactory } from 'src/Types/AuthUser';
import usePermissions from 'src/Hooks/usePermissions';
import { usePage } from '@inertiajs/inertia-react';
import { Permissions } from 'src/Types/Permission';
import { renderHook } from '@testing-library/react';

jest.mock('@inertiajs/inertia-react');

describe('The User module', () => {
  it('can detect if a user has a permission', () => {
    const testCases = [
      {
        user: AuthUserFactory.build({
          permissions: [
            Permissions.CREATE_DONATIONS,
            Permissions.VIEW_DONATIONS,
          ],
        }),
        permissions: [Permissions.VIEW_DONATIONS],
        expected: [true],
      },
      {
        user: AuthUserFactory.build({
          permissions: [],
        }),
        permissions: [Permissions.VIEW_DONATIONS],
        expected: [false],
      },
      {
        user: AuthUserFactory.build({
          permissions: [
            Permissions.CREATE_DONATIONS,
            Permissions.VIEW_DONATIONS,
          ],
        }),
        permissions: [Permissions.VIEW_DONATIONS, Permissions.DELETE_USERS],
        expected: [true, false],
      },
      {
        user: AuthUserFactory.build({
          permissions: [Permissions.EDIT_USERS],
        }),
        permissions: [Permissions.EDIT_USERS],
        expected: [true],
      },
      {
        user: AuthUserFactory.build({
          permissions: [Permissions.DELETE_USERS],
        }),
        permissions: [Permissions.EDIT_USERS, Permissions.DELETE_USERS],
        expected: [false, true],
      },
    ];

    const mockUsePage = usePage as jest.Mock;
    testCases.forEach((testCase) => {
      mockUsePage.mockImplementationOnce(() => {
        return {
          props: {
            authUser: testCase.user,
          },
        };
      });
      const { result } = renderHook(() => usePermissions(testCase.permissions));
      expect(result.current).toEqual(testCase.expected);
    });
  });
});
