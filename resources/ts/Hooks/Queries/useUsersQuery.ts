import { useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { useForm } from '@inertiajs/inertia-react';

interface UseUsersQueryProps {
  filter?: {
    search: string;
    role: string[];
    status: string;
  };
}

const useUsersQuery = (filter?: UseUsersQueryProps) => {
  const defaultValues = {
    filter: {
      role: new Array<string>(),
      search: '',
      status: '',
    },
  };

  // merge default and url filters to ensure that the initialValues contains all the properties required
  const initialValues =
    filter && filter.filter
      ? { ...defaultValues.filter, ...filter.filter }
      : defaultValues.filter;
  const { data, get, processing, setData } = useForm({ filter: initialValues });

  const [debouncedSearch] = useDebounce<string>(data.filter.search ?? '', 300);
  const isMounted = useRef<boolean>(false);

  const fetchUsers = () => {
    void get(`/users`, {
      preserveState: true,
      replace: true,
    });
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    fetchUsers();
  }, [debouncedSearch, data.filter.role, data.filter.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const filterRoles = (values: string[]) => {
    setData('filter', {
      ...data.filter,
      ...{ role: values },
    });
  };

  const filterStatus = (value: string) => {
    setData('filter', {
      ...data.filter,
      ...{ status: value },
    });
  };

  const setSearch = (value: string) =>
    setData('filter', { ...data.filter, ...{ search: value } });

  return {
    search: data.filter.search ?? '',
    status: data.filter.status,
    setSearch,
    filterRoles,
    filterStatus,
    processing,
  };
};

export default useUsersQuery;
