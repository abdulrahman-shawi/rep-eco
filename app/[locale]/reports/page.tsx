'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { BarChart3, FileText, TrendingUp, Package, Users, Briefcase, DollarSign } from 'lucide-react';
import { getMessages } from '@/lib/i18n';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function ReportsPage() {
  const params = useParams();
  const locale = params.locale as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const t = getMessages(locale);

  const [activeReport, setActiveReport] = useState('sales');

  const salesData = [
    { month: isRTL ? 'يناير' : 'Jan', sales: 45000, purchases: 32000 },
    { month: isRTL ? 'فبراير' : 'Feb', sales: 52000, purchases: 38000 },
    { month: isRTL ? 'مارس' : 'Mar', sales: 48000, purchases: 35000 },
    { month: isRTL ? 'أبريل' : 'Apr', sales: 61000, purchases: 42000 },
    { month: isRTL ? 'مايو' : 'May', sales: 55000, purchases: 40000 },
    { month: isRTL ? 'يونيو' : 'Jun', sales: 67000, purchases: 45000 },
  ];

  const inventoryData = [
    { name: isRTL ? 'فئة 1' : 'Category 1', value: 400 },
    { name: isRTL ? 'فئة 2' : 'Category 2', value: 300 },
    { name: isRTL ? 'فئة 3' : 'Category 3', value: 200 },
    { name: isRTL ? 'فئة 4' : 'Category 4', value: 100 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const reportTypes = [
    { id: 'sales', label: t.reports.salesReport, icon: TrendingUp },
    { id: 'purchases', label: t.reports.purchaseReport, icon: DollarSign },
    { id: 'inventory', label: t.reports.inventoryReport, icon: Package },
    { id: 'financial', label: t.reports.financialReport, icon: BarChart3 },
    { id: 'projects', label: t.reports.projectReport, icon: Briefcase },
    { id: 'hr', label: t.reports.hrReport, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.app.reports}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {isRTL ? 'تحليلات وإحصائيات شاملة' : 'Comprehensive analytics and statistics'}
        </p>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
              activeReport === report.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <report.icon
              className={`w-6 h-6 ${
                activeReport === report.id ? 'text-blue-600' : 'text-gray-500'
              }`}
            />
            <span
              className={`text-xs font-medium ${
                activeReport === report.id ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {report.label}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t.reports.fromDate}
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t.reports.toDate}
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            {t.reports.generate}
          </button>
        </div>
      </div>

      {/* Charts */}
      {activeReport === 'sales' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.reports.salesReport}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="purchases" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {isRTL ? 'اتجاه المبيعات' : 'Sales Trend'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="purchases" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeReport === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.reports.inventoryReport}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {isRTL ? 'توزيع المخزون' : 'Inventory Distribution'}
            </h3>
            <div className="space-y-4">
              {inventoryData.map((item, i) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                    <span className="text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(item.value / 1000) * 100}%`,
                        backgroundColor: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeReport === 'financial' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t.reports.financialReport}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-600">{isRTL ? 'إجمالي الأصول' : 'Total Assets'}</p>
              <p className="text-2xl font-bold text-blue-700">0</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm text-red-600">{isRTL ? 'إجمالي الخصوم' : 'Total Liabilities'}</p>
              <p className="text-2xl font-bold text-red-700">0</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-600">{isRTL ? 'حقوق الملكية' : 'Equity'}</p>
              <p className="text-2xl font-bold text-green-700">0</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-purple-600">{isRTL ? 'صافي الدخل' : 'Net Income'}</p>
              <p className="text-2xl font-bold text-purple-700">0</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
