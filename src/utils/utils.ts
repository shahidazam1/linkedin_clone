import * as mongoose from 'mongoose';

export function checkEqual(id1: any, id2: any) {
  if (id1 instanceof mongoose.Types.ObjectId) {
    return id1.equals(id2);
  }
  if (id2 instanceof mongoose.Types.ObjectId) {
    return id2.equals(id1);
  }
  return id1 === id2;
}
