import {
  hash,
  hashSync,
  compare
} from 'bcrypt';

const saltRounds = 10;

/**
 * hash password sync
 * @param {string} password
 */
export function hashPasswordSync(
  password: string
): string {
  return hashSync(password, saltRounds);
}

/**
 * hash password async
 * @param {string} password
 */
export async function hashPassword(
  password: string
): Promise<string> {
  return await hash(password, saltRounds);
}

/**
 * compare password async
 * @param {string} plainPassword
 * @param {string} hashPassword
 */
export async function comparePassword(
  plainPassword: string,
  hashPassword: string
): Promise<boolean> {
  return await compare(plainPassword, hashPassword);
}
