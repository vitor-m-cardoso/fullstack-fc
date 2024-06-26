import { Request, Response, NextFunction } from 'express';
import verifyToken from '../utils/auth';

function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }
  return next();
}

function validateEmail(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(email);

  if (!isEmailValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return next();
}

function validatePassword(req: Request, res: Response, next: NextFunction) {
  const { password } = req.body;
  const minLength = 6;

  if (password.length < minLength) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  return next();
}

function validateToken(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const decoded = verifyToken(authorization);

    if (!decoded) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    res.locals = decoded;
    return next();
  } catch (err) {
    // console.error(err);
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
}

export {
  validateLogin,
  validateEmail,
  validatePassword,
  validateToken,
};
