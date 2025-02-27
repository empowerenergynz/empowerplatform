import { useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { useForm } from '@inertiajs/inertia-react';

interface UseAgenciesQueryProps {
  filter?: {
    search: string;
  };
}

const useAgenciesQuery = (filter?: UseAgenciesQueryProps) => {
  const defaultValues = {
    filter: {
      search: '',
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

  const fetchAgencies = () => {
    void get(`/agencies`, {
      preserveState: true,
      replace: true,
    });
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    fetchAgencies();
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const setSearch = (value: string) =>
    setData('filter', { ...data.filter, ...{ search: value } });

  return {
    search: data.filter.search ?? '',
    setSearch,
    processing,
  };
};

export default useAgenciesQuery;
