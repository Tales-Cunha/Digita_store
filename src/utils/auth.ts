import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'; // Default to 1 hour if not set
/**
 * Hashes a plaintext password using bcrypt.
 * @param plaintextPassword The password to hash.
 * @returns A promise that resolves to the hashed password.
 */

export const hashPassword = async (
  plaintextPassword: string
): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(plaintextPassword, SALT_ROUNDS);
    return hashedPassword;
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

if (!JWT_SECRET) {
  console.error(
    'FATAL ERROR: JWT_SECRET is not defined in environment variables.'
  );
  // In a real app, you might throw an error or exit to prevent running in an insecure state.
  // For now, we'll log and proceed, but tokens won't be secure.
  // Consider process.exit(1) in a real startup sequence if not set.
}

/**
 * Generates a JWT for a given user payload.
 * @param payload The user-specific data to include in the token (e.g., id, role).
 * Avoid putting sensitive information here unless necessary and encrypted.
 * @returns The generated JWT string.
 */

export const generateToken = (payload: object): string => {
  if (!JWT_SECRET) {
    // This check is important if the process didn't exit above.
    throw new Error('JWT_SECRET is not available for signing tokens.');
  }
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return token;
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Token generation failed');
  }
};

export const verifyToken = (token: string): object | string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not available for verifying tokens.');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    // error.name could be 'JsonWebTokenError', 'TokenExpiredError', etc.
    // You might want to handle these specific errors differently.
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};
