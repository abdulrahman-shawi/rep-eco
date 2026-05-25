import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const companies = await prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ companies });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    const company = await prisma.company.create({ data });

    return NextResponse.json({ company });
  } catch {
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
