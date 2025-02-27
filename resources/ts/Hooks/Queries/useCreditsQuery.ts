import { useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/inertia-react';

interface UseCreditsQueryProps {
  filter?: {
    status: string;
  };
}

const useCreditsQuery = (filter?: UseCreditsQueryProps) => {
  const defaultValues = {
    filter: {
      status: '',
    },
  };

  // merge default and url filters to ensure that the initialValues contains all the properties required
  const initialValues =
    filter && filter.filter
      ? { ...defaultValues.filter, ...filter.filter }
      : defaultValues.filter;
  const { data, get, processing, setData } = useForm({ filter: initialValues });

  const isMounted = useRef<boolean>(false);

  const fetchUsers = () => {
    void get(`/credits`, {
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
  }, [data.filter.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const filterStatus = (value: string) => {
    setData('filter', {
      ...data.filter,
      ...{ status: value },
    });
  };

  return {
    status: data.filter.status,
    filterStatus,
    processing,
  };
};

export default useCreditsQuery;
