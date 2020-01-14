import {
  ObjectID
} from 'typeorm';

export function objectIdToString(id: ObjectID): string {
  return id.toString();
}
