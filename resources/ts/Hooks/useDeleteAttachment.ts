import { Inertia } from '@inertiajs/inertia';
import { Upload } from 'src/Types/Upload';

const useDeleteAttachment = () => {
  const deleteAttachment = (upload: Upload) => {
    Inertia.delete(`/media/${upload.id}`);
  };

  return deleteAttachment;
};

export default useDeleteAttachment;
