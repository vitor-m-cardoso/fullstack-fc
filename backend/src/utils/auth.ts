import * as jwt from './jwt';
import { TokenPayload } from '../types/Token';

function removeBearer(bearerToken: string): string | undefined {
  return bearerToken.split(' ')[1];
}

function verifyToken(authorization: string): TokenPayload | null {
  const token = removeBearer(authorization);
  if (!token) return null;
  const decoded = jwt.verify(token);
  return decoded;
}

export default verifyToken;
