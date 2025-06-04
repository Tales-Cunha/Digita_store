import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password using bcrypt.
 * @param plaintextPassword The password to hash.
 * @returns A promise that resolves to the hashed password.
 */

export const hashPassword = async (
  plaintextPassword: string
): Promise<string> => {
  try {
    const hashPassword = await bcrypt.hash(plaintextPassword, SALT_ROUNDS);
    return hashPassword;
  } catch (error) {
    console.error('Error hashing password', error);
    throw new Error('password hashing failed');
  }
};

/**
 * Compares a plaintext password with a stored hash.
 * @param plaintextPassword The plaintext password to compare.
 * @param hash The stored hashed password to compare against.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */

export const comparePassword = async (
  plaintextPassword: string,
  hash: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(plaintextPassword, hash);
    return isMatch;
  } catch (error) {
    console.error('Error comparing password:', error);
    // Similarly, handle errors appropriately
    throw new Error('Password comparison failed');
  }
};
