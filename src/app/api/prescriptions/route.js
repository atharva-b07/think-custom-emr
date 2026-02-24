import { NextResponse } from 'next/server';
import { prescriptions } from '@/data/cpoeData';

export async function GET() {
  return NextResponse.json(prescriptions);
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ success: true, prescription: body }, { status: 201 });
}
