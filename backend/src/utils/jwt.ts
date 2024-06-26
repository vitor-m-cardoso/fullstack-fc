import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/Token';

const secret = process.env.JWT_SECRET || 'secret';

const jwtConfig: jwt.SignOptions = {
  expiresIn: '8h',
  algorithm: 'HS256',
};

export const sign = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, secret, jwtConfig);
  return token;
};

export const verify = (token: string): TokenPayload => {
  const data = jwt.verify(token, secret) as TokenPayload;
  return data;
};
