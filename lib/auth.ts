import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'erp-secret';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: number; email: string; companyId: number; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: number; email: string; companyId: number; role: string } {
  return jwt.verify(token, JWT_SECRET) as any;
}

export async function getUserFromRequest() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('erp-token')?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}
