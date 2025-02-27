import { useForm } from '@inertiajs/inertia-react';
import { FormEvent } from 'react';

const useUploadFilesForm = (url: string) => {
  const form = useForm({
    files: new Array<File>(),
  });

  const submit = (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    void form.post(url, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => form.reset('files'),
    });
  };

  return {
    formState: form,
    handlers: { submit },
  };
};

export default useUploadFilesForm;
