import { useForm } from '@inertiajs/inertia-react';
import { FormEvent } from 'react';
import { User } from 'src/Types/User';

const useSignUpForm = (user: User, token: string) => {
  const form = useForm({
    email: user.email,
    phone_number: user.phone_number ?? '',
    password: '',
    password_confirmation: '',
    token,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void form.post('/sign-up');
  };

  return {
    formState: form,
    handlers: { submit },
  };
};

export default useSignUpForm;
