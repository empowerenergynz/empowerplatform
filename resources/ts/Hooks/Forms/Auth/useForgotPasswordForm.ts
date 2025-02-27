import { useForm } from '@inertiajs/inertia-react';
import { FormEvent } from 'react';

const useForgotPasswordForm = () => {
  const form = useForm({
    email: '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void form.post('/forgot-password');
  };

  return {
    formState: form,
    handlers: { submit },
  };
};

export default useForgotPasswordForm;
