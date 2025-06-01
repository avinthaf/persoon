import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserData, VerifiedUser } from '../interfaces/User';

const DEFAULT_JWT_SECRET = 'your-strong-secret-key';
const DEFAULT_JWT_EXPIRES_IN = '86400000';

const getJwtConfig = () => ({
  secret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN
});

export function generateJWTToken(user: UserData): string {
  const { secret, expiresIn } = getJwtConfig();

  if (!secret || secret === DEFAULT_JWT_SECRET) {
    console.warn('⚠️  Using default JWT secret. Set JWT_SECRET environment variable to use your own.');
  }

  const payload = {
    ...user,
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, secret, { expiresIn: parseInt(expiresIn) });
}


export function verifyJWTToken(token: string): UserData {
  const { secret } = getJwtConfig();
  return jwt.verify(token, secret) as UserData;
}

export function getUser(token: string): VerifiedUser {
  const { secret } = getJwtConfig();

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secret) as JwtPayload;

    return {
      valid: true,
      user: {
        id: decoded.id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        token: decoded.token,
        iat: decoded.iat?.toString(),
        exp: decoded.exp?.toString()
      }
    };
  } catch (error) {
    return {
      valid: false,
      user: null,
      error: error instanceof Error ? error.message : 'Invalid token'
    };
  }
}