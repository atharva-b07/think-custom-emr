import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const TOKEN_NAME = 'rcm_token';
const TOKEN_MAX_AGE = 60 * 60 * 24; // 24 hours

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Please define JWT_SECRET environment variable');
  return secret;
}

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_MAX_AGE });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

export async function setAuthCookie(payload) {
  const token = signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });
  return token;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
