import { NextResponse } from 'next/server';
import { encounters, claims } from '@/data/billingData';

export async function GET() {
  return NextResponse.json({ encounters, claims });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: body }, { status: 201 });
}
