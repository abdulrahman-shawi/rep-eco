'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Factory, Plus, Package, Hammer } from 'lucide-react';
import { getMessages } from '@/lib/i18n';

export default function ManufacturingPage() {
  const params = useParams();
  const locale = params.locale as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const t = getMessages(locale);

  const [activeTab, setActiveTab] = useState<'bom' | 'production' | 'operations'>('bom');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.app.manufacturing}</h1>
      </div>

      <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
        {(['bom', 'production', 'operations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {tab === 'bom' && (isRTL ? 'قائمة المواد' : 'Bill of Materials')}
            {tab === 'production' && (isRTL ? 'أوامر الإنتاج' : 'Production Orders')}
            {tab === 'operations' && (isRTL ? 'متابعة التشغيل' : 'Operations Tracking')}
          </button>
        ))}
      </div>

      {activeTab === 'bom' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isRTL ? 'قوائم المواد (BOM)' : 'Bill of Materials'}
            </h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">
              <Plus className="w-4 h-4" />
              {t.app.add}
            </button>
          </div>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{isRTL ? 'لا توجد قوائم مواد' : 'No BOM records'}</p>
          </div>
        </div>
      )}

      {activeTab === 'production' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
                <Factory className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {isRTL ? 'أمر إنتاج 1' : 'Production Order 1'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">PO-001</p>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">{isRTL ? 'التقدم' : 'Progress'}</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'operations' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Hammer className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isRTL ? 'متابعة التشغيل والإنتاج' : 'Operations & Production Tracking'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-sm text-gray-500">{isRTL ? 'خط إنتاج نشط' : 'Active Lines'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
              <p className="text-sm text-gray-500">{isRTL ? 'كفاءة الإنتاج' : 'Efficiency'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,250</p>
              <p className="text-sm text-gray-500">{isRTL ? 'وحدة/يوم' : 'Units/Day'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              <p className="text-sm text-gray-500">{isRTL ? 'أعطال' : 'Downtime'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
