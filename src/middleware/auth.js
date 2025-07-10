const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Decoded JWT:', decoded); 
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate;
