import { useForm } from '@inertiajs/inertia-react';
import { FormEvent } from 'react';

const useLoginForm = () => {
  const form = useForm({
    email: '',
    password: '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void form.post('/login', {
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return {
    formState: form,
    handlers: { submit },
  };
};

export default useLoginForm;
