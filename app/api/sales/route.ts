import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const orders = await prisma.salesOrder.findMany({
      where: { companyId: payload.companyId },
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const { items, ...orderData } = data;

    const order = await prisma.salesOrder.create({
      data: {
        ...orderData,
        companyId: payload.companyId,
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
            productId: item.productId,
          })),
        },
      },
      include: { items: true, customer: true },
    });

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
