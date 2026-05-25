import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const stock = await prisma.stock.findMany({
      where: { warehouse: { companyId: payload.companyId } },
      include: { product: true, warehouse: true },
      orderBy: { quantity: 'asc' },
    });

    return NextResponse.json({ stock });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
  }
}
