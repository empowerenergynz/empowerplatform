import { useForm } from '@inertiajs/inertia-react';
import { FormEvent } from 'react';

const useResetPasswordForm = (email: string, token: string) => {
  const form = useForm({
    email,
    token,
    password: '',
    password_confirmation: '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void form.post('/reset-password');
  };

  return {
    formState: form,
    handlers: { submit },
  };
};

export default useResetPasswordForm;
