import { Factory } from 'fishery';
import faker from '@faker-js/faker';

export interface Upload {
  id: number;
  name: string;
  url: string;
  created_at: string;
  mime_type: string;
  size: number;
  can_be_deleted: boolean;
}

export const UploadFactory = Factory.define<Upload>(() => ({
  id: faker.datatype.number(),
  name: faker.lorem.text(),
  created_at: faker.date.recent(100).toISOString(),
  url: faker.internet.url(),
  mime_type: 'image/jpeg',
  size: faker.datatype.number(),
  can_be_deleted: true,
}));

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const isImage = (upload: Upload) => upload.mime_type.startsWith('image');
