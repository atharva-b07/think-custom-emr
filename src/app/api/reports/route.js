import { NextResponse } from 'next/server';
import { reports } from '@/data/reportsData';

export async function GET() {
  return NextResponse.json(reports);
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ success: true, report: body }, { status: 201 });
}
