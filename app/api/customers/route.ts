import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const customers = await prisma.customer.findMany({
      where: { companyId: payload.companyId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ customers });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const customer = await prisma.customer.create({
      data: { ...data, companyId: payload.companyId },
    });

    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
