import { useForm } from '@inertiajs/inertia-react';
import useUsersQuery from 'src/Hooks/Queries/useUsersQuery';
import { renderHook } from '@testing-library/react';

jest.mock('use-debounce', () => {
  return {
    useDebounce: jest.fn((value) => [value]),
  };
});
jest.mock('@inertiajs/inertia-react');

describe('The use UserQuery hook', () => {
  it('gets a list of users when the search is updated', () => {
    const get = jest.fn();
    const setData = jest.fn();
    const mockUseForm = useForm as jest.Mock;
    mockUseForm.mockImplementationOnce(() => {
      return {
        data: { filter: { search: '' } },
        get,
        setData,
        processing: false,
      };
    });

    const { result, rerender } = renderHook(() => useUsersQuery());
    const searchValue = 'foo';
    result.current.setSearch(searchValue);

    expect(setData).toHaveBeenCalledWith('filter', { search: searchValue });

    mockUseForm.mockImplementationOnce(() => {
      return {
        data: { filter: { search: searchValue } },
        get,
        setData,
        processing: false,
      };
    });

    rerender();

    expect(get).toHaveBeenCalledWith(`/users`, {
      preserveState: true,
      replace: true,
    });
  });

  it('gets a list of users when the role dropdown is updated', () => {
    const get = jest.fn();
    const setData = jest.fn();
    const mockUseForm = useForm as jest.Mock;
    mockUseForm.mockImplementationOnce(() => {
      return {
        data: { filter: { role: '' } },
        get,
        setData,
        processing: false,
      };
    });

    const { result, rerender } = renderHook(() => useUsersQuery());
    const roleValues = ['1'];
    result.current.filterRoles(roleValues);

    expect(setData).toHaveBeenCalledWith('filter', { role: roleValues });

    mockUseForm.mockImplementationOnce(() => {
      return {
        data: { filter: { role: roleValues } },
        get,
        setData,
        processing: false,
      };
    });

    rerender();

    expect(get).toHaveBeenCalledWith(`/users`, {
      preserveState: true,
      replace: true,
    });
  });

  it('gets a list of users when the status dropdown is updated', () => {
    const get = jest.fn();
    const setData = jest.fn();
    const mockUseForm = useForm as jest.Mock;
    mockUseForm.mockImplementationOnce(() => {
      return {
        data: { filter: { status: '' } },
        get,
        setData,
        processing: false,
      };
    });

    const { result, rerender } = renderHook(() => useUsersQuery());
    const statusValue = 'invited';
    result.current.filterStatus(statusValue);

    expect(setData).toHaveBeenCalledWith('filter', { status: 'invited' });

    mockUseForm.mockImplementationOnce(() => {
      return {
        data: { filter: { status: statusValue } },
        get,
        setData,
        processing: false,
      };
    });

    rerender();

    expect(get).toHaveBeenCalledWith(`/users`, {
      preserveState: true,
      replace: true,
    });
  });
});
