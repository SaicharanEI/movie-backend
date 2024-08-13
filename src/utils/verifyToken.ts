// utils/verifyToken.js
import jwt from 'jsonwebtoken';

export const verifyToken = (handler) => async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to the request object
    req.user = decoded;

    // Call the actual API route handler
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
