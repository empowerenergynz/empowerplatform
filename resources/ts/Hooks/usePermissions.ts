import { usePage } from '@inertiajs/inertia-react';
import { Page } from '@inertiajs/inertia';
import { AppSharedProps } from 'src/Types/AppSharedProps';
import { Permissions } from 'src/Types/Permission';

function usePermissions(permissions: Permissions[]): boolean[] {
  const {
    props: { authUser },
  } = usePage<Page<AppSharedProps>>();

  return permissions.map((permission) =>
    authUser.permissions.includes(permission)
  );
}

export default usePermissions;
