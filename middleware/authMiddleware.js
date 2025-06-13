// middleware/authMiddleware.js
const { auth } = require('../config/firebaseAdmin');

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send({ status: 'error', message: 'Unauthorized: No token provided.' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send({ status: 'error', message: 'Unauthorized: Invalid token.' });
  }
};

module.exports = verifyFirebaseToken;