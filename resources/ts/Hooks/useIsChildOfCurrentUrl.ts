import { usePage } from '@inertiajs/inertia-react';
import { Page } from '@inertiajs/inertia';
import { AppSharedProps } from 'src/Types/AppSharedProps';

const useIsChildOfCurrentUrl = (itemUrl: string) => {
  const { url } = usePage<Page<AppSharedProps>>();

  if (itemUrl === '/') {
    return url === '/';
  }

  return url.startsWith(itemUrl);
};

export default useIsChildOfCurrentUrl;
