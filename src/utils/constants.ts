import * as bcrypt from 'bcrypt';

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export enum EMPLOYEE_TYPE {
  'Full-Time',
  'Part-Time',
  'Self-Employed',
  'Internship',
  'Trainee',
}

export enum REQUEST_STATUS {
  'Accepted',
  'Pending',
  'Rejected',
}
