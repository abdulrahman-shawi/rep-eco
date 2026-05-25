import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const entries = await prisma.journalEntry.findMany({
      where: { companyId: payload.companyId },
      include: {
        items: {
          include: { account: true, costCenter: true, project: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ entries });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const { items, ...entryData } = data;

    const totalDebit = items.reduce((sum: number, item: any) => sum + (item.debit || 0), 0);
    const totalCredit = items.reduce((sum: number, item: any) => sum + (item.credit || 0), 0);

    const entry = await prisma.journalEntry.create({
      data: {
        ...entryData,
        totalDebit,
        totalCredit,
        companyId: payload.companyId,
        items: {
          create: items.map((item: any) => ({
            debit: item.debit || 0,
            credit: item.credit || 0,
            description: item.description,
            accountId: item.accountId,
            costCenterId: item.costCenterId || null,
            projectId: item.projectId || null,
          })),
        },
      },
      include: { items: { include: { account: true } } },
    });

    return NextResponse.json({ entry });
  } catch {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
