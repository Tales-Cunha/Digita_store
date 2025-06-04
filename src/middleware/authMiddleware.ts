import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import UserAttributes from '../models/User';

// Define a type for the user object that will be attached to the request
// This should match the structure of the user object returned by your Passport strategy

export interface AuthenticateRequest extends Request {
  user?: UserAttributes;
}

/**
 * Authentication middleware that uses the 'jwt' Passport strategy.
 * It checks for a valid JWT in the Authorization header.
 * If valid, it attaches the user object to req.user and calls next().
 * If invalid or not present, it returns a 401 Unauthorized error.
 */

export const authenticateJwt = (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: any, user: UserAttributes | false, info: any) => {
      if (err) {
        // If Passport encounters an error (e.g., during user lookup if there was a DB error)
        console.error('Authentication error:', err);
        return next(err);
      }
      if (!user) {
        let message = 'Unauthorized';
        if (info && info.message) {
          message = info.message;
        } else if (info && info instanceof Error) {
          message =
            info.name === 'TokeExpiredError'
              ? 'Token Expired'
              : 'Invalid Token';
        } else if (typeof info === 'string') {
          message = info;
        }
        if (info) {
          console.warn(
            `Authentication failed: ${info.name || 'No user'} - ${info.message || 'No specific info'}`
          );
        } else {
          console.warn(
            'Authentication failed: No user returned and no info object.'
          );
        }

        return res.status(401).json({ message });
      }
      req.user = user;
      return next();
    }
  )(req, res, next);
};
