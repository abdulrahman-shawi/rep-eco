import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getUserFromRequest();
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = payload.companyId;

    const [
      productsCount,
      customersCount,
      suppliersCount,
      employeesCount,
      projectsCount,
      purchaseOrdersCount,
      salesOrdersCount,
      warehouses,
      recentPurchaseOrders,
      recentSalesOrders,
      accounts,
    ] = await Promise.all([
      prisma.product.count({ where: { companyId } }),
      prisma.customer.count({ where: { companyId } }),
      prisma.supplier.count({ where: { companyId } }),
      prisma.employee.count({ where: { companyId } }),
      prisma.project.count({ where: { companyId } }),
      prisma.purchaseOrder.count({ where: { companyId } }),
      prisma.salesOrder.count({ where: { companyId } }),
      prisma.warehouse.findMany({
        where: { companyId },
        include: { stockItems: { include: { product: true } } },
      }),
      prisma.purchaseOrder.findMany({
        where: { companyId },
        include: { supplier: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.salesOrder.findMany({
        where: { companyId },
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.account.findMany({ where: { companyId } }),
    ]);

    let totalInventoryValue = 0;
    warehouses.forEach((w) => {
      w.stockItems.forEach((s) => {
        totalInventoryValue += s.quantity * (s.avgCost || 0);
      });
    });

    const totalAssets = accounts
      .filter((a) => a.type === 'asset')
      .reduce((sum, a) => sum + (a.balance || 0), 0);
    const totalLiabilities = accounts
      .filter((a) => a.type === 'liability')
      .reduce((sum, a) => sum + (a.balance || 0), 0);
    const totalEquity = accounts
      .filter((a) => a.type === 'equity')
      .reduce((sum, a) => sum + (a.balance || 0), 0);
    const totalRevenue = accounts
      .filter((a) => a.type === 'revenue')
      .reduce((sum, a) => sum + (a.balance || 0), 0);
    const totalExpenses = accounts
      .filter((a) => a.type === 'expense')
      .reduce((sum, a) => sum + (a.balance || 0), 0);

    return NextResponse.json({
      counts: {
        products: productsCount,
        customers: customersCount,
        suppliers: suppliersCount,
        employees: employeesCount,
        projects: projectsCount,
        purchaseOrders: purchaseOrdersCount,
        salesOrders: salesOrdersCount,
      },
      financial: {
        totalAssets,
        totalLiabilities,
        totalEquity,
        totalRevenue,
        totalExpenses,
        netIncome: totalRevenue - totalExpenses,
      },
      inventory: {
        totalValue: totalInventoryValue,
        warehouses: warehouses.length,
      },
      recentPurchases: recentPurchaseOrders,
      recentSales: recentSalesOrders,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
