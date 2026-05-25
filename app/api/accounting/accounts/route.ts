import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const accounts = await prisma.account.findMany({
      where: { companyId: payload.companyId },
      include: { parent: true, children: true },
      orderBy: { code: 'asc' },
    });

    return NextResponse.json({ accounts });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const account = await prisma.account.create({
      data: { ...data, companyId: payload.companyId },
    });

    return NextResponse.json({ account });
  } catch {
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
