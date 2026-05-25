import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default company
  const company = await prisma.company.create({
    data: {
      name: 'الشركة الافتراضية',
      nameEn: 'Default Company',
      address: 'العنوان الافتراضي',
      phone: '123456789',
      email: 'info@company.com',
      defaultCurrency: 'USD',
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'مدير النظام',
      email: 'admin@erp.com',
      password: hashedPassword,
      role: 'admin',
      companyId: company.id,
    },
  });

  // Create default currencies
  await prisma.currency.createMany({
    data: [
      { code: 'USD', name: 'US Dollar', nameAr: 'دولار أمريكي', symbol: '$', isDefault: true, isActive: true, companyId: company.id },
      { code: 'EUR', name: 'Euro', nameAr: 'يورو', symbol: '€', rate: 0.92, isActive: true, companyId: company.id },
      { code: 'SAR', name: 'Saudi Riyal', nameAr: 'ريال سعودي', symbol: 'ر.س', rate: 3.75, isActive: true, companyId: company.id },
      { code: 'AED', name: 'UAE Dirham', nameAr: 'درهم إماراتي', symbol: 'د.إ', rate: 3.67, isActive: true, companyId: company.id },
      { code: 'IQD', name: 'Iraqi Dinar', nameAr: 'دينار عراقي', symbol: 'د.ع', rate: 1310, isActive: true, companyId: company.id },
    ],
  });

  // Create default warehouse
  await prisma.warehouse.create({
    data: {
      name: 'المستودع الرئيسي',
      nameEn: 'Main Warehouse',
      code: 'WH-001',
      location: 'الموقع الرئيسي',
      companyId: company.id,
    },
  });

  // Create chart of accounts
  const accounts = [
    { code: '1', name: 'الأصول', nameEn: 'Assets', type: 'asset', level: 1 },
    { code: '11', name: 'الأصول المتداولة', nameEn: 'Current Assets', type: 'asset', level: 2 },
    { code: '1101', name: 'النقدية', nameEn: 'Cash', type: 'asset', level: 3 },
    { code: '1102', name: 'البنك', nameEn: 'Bank', type: 'asset', level: 3 },
    { code: '1103', name: 'العملاء', nameEn: 'Accounts Receivable', type: 'asset', level: 3 },
    { code: '1104', name: 'المخزون', nameEn: 'Inventory', type: 'asset', level: 3 },
    { code: '12', name: 'الأصول الثابتة', nameEn: 'Fixed Assets', type: 'asset', level: 2 },
    { code: '1201', name: 'الأرض', nameEn: 'Land', type: 'asset', level: 3 },
    { code: '1202', name: 'المباني', nameEn: 'Buildings', type: 'asset', level: 3 },
    { code: '1203', name: 'الآلات والمعدات', nameEn: 'Machinery & Equipment', type: 'asset', level: 3 },
    { code: '2', name: 'الخصوم', nameEn: 'Liabilities', type: 'liability', level: 1 },
    { code: '21', name: 'الخصوم المتداولة', nameEn: 'Current Liabilities', type: 'liability', level: 2 },
    { code: '2101', name: 'الموردين', nameEn: 'Accounts Payable', type: 'liability', level: 3 },
    { code: '2102', name: 'القروض قصيرة الأجل', nameEn: 'Short-term Loans', type: 'liability', level: 3 },
    { code: '3', name: 'حقوق الملكية', nameEn: 'Equity', type: 'equity', level: 1 },
    { code: '31', name: 'رأس المال', nameEn: 'Capital', type: 'equity', level: 2 },
    { code: '3101', name: 'رأس المال المدفوع', nameEn: 'Paid-in Capital', type: 'equity', level: 3 },
    { code: '32', name: 'الأرباح المحتجزة', nameEn: 'Retained Earnings', type: 'equity', level: 2 },
    { code: '4', name: 'الإيرادات', nameEn: 'Revenue', type: 'revenue', level: 1 },
    { code: '41', name: 'إيرادات المبيعات', nameEn: 'Sales Revenue', type: 'revenue', level: 2 },
    { code: '4101', name: 'مبيعات المنتجات', nameEn: 'Product Sales', type: 'revenue', level: 3 },
    { code: '42', name: 'إيرادات أخرى', nameEn: 'Other Revenue', type: 'revenue', level: 2 },
    { code: '5', name: 'المصروفات', nameEn: 'Expenses', type: 'expense', level: 1 },
    { code: '51', name: 'تكلفة البضاعة المباعة', nameEn: 'Cost of Goods Sold', type: 'expense', level: 2 },
    { code: '5101', name: 'تكلفة المشتريات', nameEn: 'Purchase Cost', type: 'expense', level: 3 },
    { code: '52', name: 'المصروفات التشغيلية', nameEn: 'Operating Expenses', type: 'expense', level: 2 },
    { code: '5201', name: 'مصروفات الرواتب', nameEn: 'Salaries Expense', type: 'expense', level: 3 },
    { code: '5202', name: 'الإيجار', nameEn: 'Rent Expense', type: 'expense', level: 3 },
    { code: '5203', name: 'المرافق', nameEn: 'Utilities', type: 'expense', level: 3 },
    { code: '5204', name: 'الإهلاك', nameEn: 'Depreciation', type: 'expense', level: 3 },
  ];

  for (const acc of accounts) {
    await prisma.account.create({
      data: {
        ...acc,
        companyId: company.id,
      },
    });
  }

  // Create sample products
  const products = [
    { sku: 'PRD-001', name: 'منتج 1', nameEn: 'Product 1', category: 'فئة 1', costPrice: 50, salePrice: 75, unit: 'piece' },
    { sku: 'PRD-002', name: 'منتج 2', nameEn: 'Product 2', category: 'فئة 1', costPrice: 100, salePrice: 150, unit: 'piece' },
    { sku: 'PRD-003', name: 'منتج 3', nameEn: 'Product 3', category: 'فئة 2', costPrice: 200, salePrice: 300, unit: 'piece' },
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: {
        ...prod,
        companyId: company.id,
      },
    });
  }

  // Create sample customers
  const customers = [
    { name: 'عميل 1', nameEn: 'Customer 1', code: 'CUST-001', phone: '111111111', creditLimit: 5000 },
    { name: 'عميل 2', nameEn: 'Customer 2', code: 'CUST-002', phone: '222222222', creditLimit: 10000 },
  ];

  for (const cust of customers) {
    await prisma.customer.create({
      data: {
        ...cust,
        companyId: company.id,
      },
    });
  }

  // Create sample suppliers
  const suppliers = [
    { name: 'مورد 1', nameEn: 'Supplier 1', code: 'SUP-001', phone: '333333333' },
    { name: 'مورد 2', nameEn: 'Supplier 2', code: 'SUP-002', phone: '444444444' },
  ];

  for (const sup of suppliers) {
    await prisma.supplier.create({
      data: {
        ...sup,
        companyId: company.id,
      },
    });
  }

  // Create sample employees
  const employees = [
    { code: 'EMP-001', name: 'موظف 1', nameEn: 'Employee 1', department: 'المبيعات', jobTitle: 'مندوب مبيعات', salary: 3000 },
    { code: 'EMP-002', name: 'موظف 2', nameEn: 'Employee 2', department: 'المحاسبة', jobTitle: 'محاسب', salary: 4000 },
    { code: 'EMP-003', name: 'موظف 3', nameEn: 'Employee 3', department: 'المستودعات', jobTitle: 'أمين مستودع', salary: 2500 },
  ];

  for (const emp of employees) {
    await prisma.employee.create({
      data: {
        ...emp,
        companyId: company.id,
      },
    });
  }

  // Create sample projects
  const projects = [
    { code: 'PRJ-001', name: 'مشروع 1', nameEn: 'Project 1', budget: 50000, status: 'active', progress: 30 },
    { code: 'PRJ-002', name: 'مشروع 2', nameEn: 'Project 2', budget: 100000, status: 'active', progress: 60 },
  ];

  for (const prj of projects) {
    await prisma.project.create({
      data: {
        ...prj,
        companyId: company.id,
      },
    });
  }

  // Create cost centers
  const costCenters = [
    { code: 'CC-001', name: 'مركز كلفة المبيعات', nameEn: 'Sales Cost Center' },
    { code: 'CC-002', name: 'مركز كلفة الإنتاج', nameEn: 'Production Cost Center' },
    { code: 'CC-003', name: 'مركز كلفة الإدارة', nameEn: 'Admin Cost Center' },
  ];

  for (const cc of costCenters) {
    await prisma.costCenter.create({
      data: {
        ...cc,
        companyId: company.id,
      },
    });
  }

  console.log('✅ Seed data created successfully!');
  console.log('Company ID:', company.id);
  console.log('Login with: admin@erp.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
