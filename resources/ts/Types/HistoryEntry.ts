import { User } from 'src/Types/User';

export interface HistoryEntryInterface {
  batch_uuid: string | null;
  causer: User;
  created_at: string;
  description: string;
  id: number;
  log_name: string;
  subject_type: string;
}

export enum HistoryEntryEvent {
  CREATED = 'created',
  UPDATED = 'updated',
  ARCHIVED = 'archived',
  RESTORED = 'restored',
}

export interface HistoryEntry<ResourceType> extends HistoryEntryInterface {
  event: HistoryEntryEvent;
  properties: UpdatedEventsProperties<ResourceType> | never[];
  subject: ResourceType;
}

interface UpdatedEventsProperties<ResourceType> {
  old: Partial<ResourceType>;
  attributes: Partial<ResourceType>;
}

export interface UpdatedEventHistoryEntry<ResourceType>
  extends HistoryEntry<ResourceType> {
  event: HistoryEntryEvent.UPDATED;
  properties: UpdatedEventsProperties<ResourceType>;
}

export const isUpdatedEventHistoryEntry = <ResourceType>(
  entry: HistoryEntry<ResourceType>
): entry is UpdatedEventHistoryEntry<ResourceType> => {
  return (
    entry.event === HistoryEntryEvent.UPDATED &&
    'attributes' in entry.properties &&
    'old' in entry.properties
  );
};
