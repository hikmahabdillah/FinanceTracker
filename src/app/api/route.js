import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Melakukan query sederhana untuk mengecek koneksi
    await prisma.$connect();
    return NextResponse.json({ status: 200, message: 'Database connected successfully!' });
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Database connection failed!', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
