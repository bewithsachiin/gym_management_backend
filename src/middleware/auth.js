// Import jsonwebtoken to verify JWT tokens
import jwt from 'jsonwebtoken';
// Import dotenv to load environment variables
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Middleware function to authenticate the JWT token
// This function checks if the request has a valid token
export const authenticateToken = (req, res, next) => {
  // Get the authorization header from the request
  const authHeader = req.headers['authorization'];
  // Extract the token from the header (format: "Bearer TOKEN")
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, return unauthorized error
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // If verification fails, return forbidden error
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    // If valid, attach the user info to the request object
    req.user = user;
    // Call the next middleware or route handler
    next();
  });
};

// Middleware function to authorize based on roles
// This function checks if the user has one of the required roles
export const authorizeRoles = (...roles) => {
  // Return a middleware function
  return (req, res, next) => {
    // Check if user is authenticated and has a role in the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      // If not, return forbidden error
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    // If yes, proceed to next
    next();
  };
};
