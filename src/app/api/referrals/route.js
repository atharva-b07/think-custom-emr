import { NextResponse } from 'next/server';
import { referrals } from '@/data/referralData';

export async function GET() {
  return NextResponse.json(referrals);
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ success: true, referral: body }, { status: 201 });
}
