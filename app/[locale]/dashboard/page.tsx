'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Package,
  Users,
  Truck,
  Briefcase,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Landmark,
  Wallet,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getMessages } from '@/lib/i18n';

export default function DashboardPage() {
  const params = useParams();
  const locale = params.locale as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const t = getMessages(locale);

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const financialData = [
    { name: isRTL ? 'الأصول' : 'Assets', value: stats?.financial?.totalAssets || 0 },
    { name: isRTL ? 'الخصوم' : 'Liabilities', value: stats?.financial?.totalLiabilities || 0 },
    { name: isRTL ? 'حقوق الملكية' : 'Equity', value: stats?.financial?.totalEquity || 0 },
  ];

  const revenueData = [
    { name: isRTL ? 'الإيرادات' : 'Revenue', value: stats?.financial?.totalRevenue || 0 },
    { name: isRTL ? 'المصروفات' : 'Expenses', value: stats?.financial?.totalExpenses || 0 },
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  const statCards = [
    {
      label: t.app.inventory,
      value: stats?.counts?.products || 0,
      icon: Package,
      color: 'bg-blue-500',
      sublabel: `${stats?.inventory?.warehouses || 0} ${isRTL ? 'مستودع' : 'Warehouses'}`,
    },
    {
      label: t.app.customers,
      value: stats?.counts?.customers || 0,
      icon: Users,
      color: 'bg-green-500',
      sublabel: '',
    },
    {
      label: t.app.suppliers,
      value: stats?.counts?.suppliers || 0,
      icon: Truck,
      color: 'bg-orange-500',
      sublabel: '',
    },
    {
      label: t.app.projects,
      value: stats?.counts?.projects || 0,
      icon: Briefcase,
      color: 'bg-purple-500',
      sublabel: '',
    },
    {
      label: t.app.purchases,
      value: stats?.counts?.purchaseOrders || 0,
      icon: ShoppingCart,
      color: 'bg-red-500',
      sublabel: '',
    },
    {
      label: t.app.sales,
      value: stats?.counts?.salesOrders || 0,
      icon: CreditCard,
      color: 'bg-teal-500',
      sublabel: '',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isRTL ? 'لوحة التحكم' : 'Dashboard'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {isRTL ? 'نظرة عامة على أداء شركتك' : 'Overview of your company performance'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.label}</p>
            {card.sublabel && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{card.sublabel}</p>
            )}
          </div>
        ))}
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isRTL ? 'الإيرادات vs المصروفات' : 'Revenue vs Expenses'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Structure */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isRTL ? 'الهيكل المالي' : 'Financial Structure'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={financialData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {financialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {financialData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-gray-600 dark:text-gray-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Financials */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isRTL ? 'المؤشرات المالية' : 'Key Financials'}
          </h3>

          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Landmark className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {isRTL ? 'صافي الدخل' : 'Net Income'}
              </span>
            </div>
            <span className="font-bold text-blue-600">
              {stats?.financial?.netIncome?.toLocaleString() || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
              </span>
            </div>
            <span className="font-bold text-green-600">
              {stats?.financial?.totalRevenue?.toLocaleString() || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {isRTL ? 'إجمالي المصروفات' : 'Total Expenses'}
              </span>
            </div>
            <span className="font-bold text-red-600">
              {stats?.financial?.totalExpenses?.toLocaleString() || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {isRTL ? 'قيمة المخزون' : 'Inventory Value'}
              </span>
            </div>
            <span className="font-bold text-purple-600">
              {stats?.inventory?.totalValue?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isRTL ? 'أحدث المشتريات' : 'Recent Purchases'}
          </h3>
          <div className="space-y-3">
            {stats?.recentPurchases?.length > 0 ? (
              stats.recentPurchases.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.supplier?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {order.netTotal?.toLocaleString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'draft'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">{isRTL ? 'لا توجد بيانات' : 'No data'}</p>
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isRTL ? 'أحدث المبيعات' : 'Recent Sales'}
          </h3>
          <div className="space-y-3">
            {stats?.recentSales?.length > 0 ? (
              stats.recentSales.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {order.netTotal?.toLocaleString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'draft'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">{isRTL ? 'لا توجد بيانات' : 'No data'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
