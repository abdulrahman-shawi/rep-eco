import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const products = await prisma.product.findMany({
      where: { companyId: payload.companyId },
      include: { stockItems: { include: { warehouse: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const { warehouseId, initialQuantity, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        companyId: payload.companyId,
      },
    });

    if (warehouseId && initialQuantity > 0) {
      await prisma.stock.create({
        data: {
          productId: product.id,
          warehouseId: parseInt(warehouseId),
          quantity: parseFloat(initialQuantity),
          avgCost: productData.costPrice || 0,
        },
      });
    }

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
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
    const { warehouseId, initialQuantity, ...productData } = data;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: productData,
    });

    // Update or create stock if warehouse provided
    if (warehouseId) {
      const existingStock = await prisma.stock.findFirst({
        where: { productId: parseInt(id), warehouseId: parseInt(warehouseId) },
      });

      if (existingStock) {
        await prisma.stock.update({
          where: { id: existingStock.id },
          data: { quantity: parseFloat(initialQuantity) || existingStock.quantity },
        });
      } else if (initialQuantity > 0) {
        await prisma.stock.create({
          data: {
            productId: parseInt(id),
            warehouseId: parseInt(warehouseId),
            quantity: parseFloat(initialQuantity),
            avgCost: productData.costPrice || 0,
          },
        });
      }
    }

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.stock.deleteMany({ where: { productId: parseInt(id) } });
    await prisma.product.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
