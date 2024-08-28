import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Parse the incoming JSON request body
    const { username, email, password } = await request.json();

    console.log('Received data:', { username, email, password });

    // Check if the user already exists by email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Email already exists');
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log('User created:', newUser);

    return NextResponse.json({ message: 'User registered successfully', user: newUser }, { status: 200 });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
