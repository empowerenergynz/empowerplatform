import { User } from 'src/Types/User';
import { Inertia } from '@inertiajs/inertia';

const useResendInvite = () => {
  const resendInvite = (user: User) => {
    Inertia.put(`/users/invitations/${user.id}`);
  };

  return resendInvite;
};

export default useResendInvite;
