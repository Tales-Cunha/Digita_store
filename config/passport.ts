import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import User from '../src/models/User'; // Adjust path as per your project structure
import dotenv from 'dotenv';

// Load environment variables, especially JWT_SECRET
dotenv.config(); // Ensure .env variables are loaded

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(
    'FATAL ERROR: JWT_SECRET is not defined in environment variables for Passport strategy.'
  );
  // In a real application, you should prevent the app from starting without a JWT_SECRET
  process.exit(1);
}

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts token from "Authorization: Bearer <token>" header
  secretOrKey: JWT_SECRET, // The same secret used to sign the JWTs
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // jwt_payload will contain the data you put into it when signing the token
      // e.g., if you signed { id: user.id, email: user.email }
      // then jwt_payload.id would be the user's ID.
      const user = await User.findByPk(jwt_payload.id); // Or whatever identifier you used in the payload

      if (user) {
        // If the user is found, call done with the user object
        return done(null, user);
      } else {
        // If user is not found (e.g., ID in token doesn't exist or user was deleted)
        return done(null, false);
        // Alternatively, you could create a new account if desired, but typically not for JWT auth
      }
    } catch (error) {
      console.error('Error in Passport JWT strategy:', error);
      return done(error, false);
    }
  })
);

export default passport; // Export the configured passport instance
