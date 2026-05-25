import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const suppliers = await prisma.supplier.findMany({
      where: { companyId: payload.companyId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ suppliers });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const supplier = await prisma.supplier.create({
      data: { ...data, companyId: payload.companyId },
    });

    return NextResponse.json({ supplier });
  } catch {
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
