'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, PieChart } from 'lucide-react';
import { getMessages } from '@/lib/i18n';

export default function CostCentersPage() {
  const params = useParams();
  const locale = params.locale as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const t = getMessages(locale);

  const [costCenters, setCostCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ code: '', name: '', nameEn: '' });

  useEffect(() => {
    fetchCostCenters();
  }, []);

  const fetchCostCenters = async () => {
    const res = await fetch('/api/accounting/accounts');
    const data = await res.json();
    // We'll get cost centers from a dedicated endpoint later
    setCostCenters([]);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.app.costCenters}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          {t.costCenters.addCostCenter}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
              {t.app.active}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {isRTL ? 'مركز كلفة المبيعات' : 'Sales Cost Center'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">CC-001</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
              {t.app.active}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {isRTL ? 'مركز كلفة الإنتاج' : 'Production Cost Center'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">CC-002</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
              {t.app.active}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {isRTL ? 'مركز كلفة الإدارة' : 'Admin Cost Center'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">CC-003</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {isRTL ? 'توزيع التكاليف' : 'Cost Distribution'}
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">
                {isRTL ? 'مركز كلفة المبيعات' : 'Sales Cost Center'}
              </span>
              <span className="text-gray-900 dark:text-white">35%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-pink-500 h-2 rounded-full" style={{ width: '35%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">
                {isRTL ? 'مركز كلفة الإنتاج' : 'Production Cost Center'}
              </span>
              <span className="text-gray-900 dark:text-white">45%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">
                {isRTL ? 'مركز كلفة الإدارة' : 'Admin Cost Center'}
              </span>
              <span className="text-gray-900 dark:text-white">20%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
