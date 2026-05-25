import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const warehouses = await prisma.warehouse.findMany({
      where: { companyId: payload.companyId },
      include: { stockItems: { include: { product: true } } },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ warehouses });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch warehouses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const warehouse = await prisma.warehouse.create({
      data: {
        ...data,
        companyId: payload.companyId,
      },
    });

    return NextResponse.json({ warehouse });
  } catch {
    return NextResponse.json({ error: 'Failed to create warehouse' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const data = await request.json();
    const warehouse = await prisma.warehouse.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json({ warehouse });
  } catch {
    return NextResponse.json({ error: 'Failed to update warehouse' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // Check if warehouse has stock
    const stockCount = await prisma.stock.count({
      where: { warehouseId: parseInt(id) },
    });

    if (stockCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete warehouse with stock items' },
        { status: 400 }
      );
    }

    await prisma.warehouse.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete warehouse' }, { status: 500 });
  }
}
