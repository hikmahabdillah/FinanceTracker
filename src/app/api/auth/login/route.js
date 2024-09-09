import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import cookie from 'cookie';

const prisma = new PrismaClient();

export async function POST(request) {
  const { email, password } = await request.json();

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const isPasswordValid = user && await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
    );

    const isProduction = process.env.NEXTAUTH_SECRET === 'aldrin44';
    const response = NextResponse.json({ message: 'Login successful' });
    response.headers.append(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: isProduction,
        path: '/',
      })
    );

    return response;
  } catch (error) {
    console.error('Error during login:', error.message);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}