import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_NAME = 'ghoroa-token';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

export function generateToken(userId: string): string {
  console.log('Generating token for user:', userId);
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    console.log('Verifying token:', token?.substring(0, 20) + '...');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log('Token verified successfully for user:', decoded.userId);
    return decoded;
  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

// Server-side cookie setting (for API routes)
export function setAuthCookie(token: string, response: NextResponse): NextResponse {
  const isProduction = process.env.NODE_ENV === 'production';
  
  response.cookies.set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction, // true for Vercel (HTTPS)
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  
  console.log('Auth cookie set successfully', { 
    isProduction,
    domain: isProduction ? '.vercel.app' : 'localhost' 
  });
  
  return response;
}

// Server-side cookie removal (for API routes)
export function removeAuthCookie(response: NextResponse): NextResponse {
  response.cookies.delete(TOKEN_NAME);
  return response;
}

// Server-side token retrieval (for Server Components)
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value || null;
}

// Get current user from request (for API routes)
export async function getCurrentUser(request?: Request) {
  if (request) {
    const cookies = request.headers.get('cookie');
    const token = cookies
      ?.split('; ')
      .find(row => row.startsWith(`${TOKEN_NAME}=`))
      ?.split('=')[1];
    
    if (token) {
      return verifyToken(token);
    }
  }
  
  return null;
}