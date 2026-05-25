'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Settings, Globe, Building2, DollarSign } from 'lucide-react';
import { getMessages } from '@/lib/i18n';

export default function SettingsPage() {
  const params = useParams();
  const locale = params.locale as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const t = getMessages(locale);

  const [activeTab, setActiveTab] = useState<'general' | 'currency' | 'language'>('general');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.app.settings}</h1>
      </div>

      <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
        {(['general', 'currency', 'language'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {tab === 'general' && (isRTL ? 'عام' : 'General')}
            {tab === 'currency' && t.app.currency}
            {tab === 'language' && t.app.languages}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isRTL ? 'إعدادات الشركة' : 'Company Settings'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{isRTL ? 'اسم الشركة' : 'Company Name'}</label>
              <input
                type="text"
                defaultValue="الشركة الافتراضية"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.app.phone}</label>
              <input
                type="text"
                defaultValue="123456789"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.app.email}</label>
              <input
                type="email"
                defaultValue="info@company.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{isRTL ? 'الرقم الضريبي' : 'Tax Number'}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">{t.app.save}</button>
        </div>
      )}

      {activeTab === 'currency' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isRTL ? 'العملات' : 'Currencies'}
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { code: 'USD', name: 'US Dollar', nameAr: 'دولار أمريكي', rate: 1, isDefault: true },
              { code: 'EUR', name: 'Euro', nameAr: 'يورو', rate: 0.92, isDefault: false },
              { code: 'SAR', name: 'Saudi Riyal', nameAr: 'ريال سعودي', rate: 3.75, isDefault: false },
              { code: 'AED', name: 'UAE Dirham', nameAr: 'درهم إماراتي', rate: 3.67, isDefault: false },
              { code: 'IQD', name: 'Iraqi Dinar', nameAr: 'دينار عراقي', rate: 1310, isDefault: false },
            ].map((currency) => (
              <div
                key={currency.code}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center text-xs font-bold text-blue-600">
                    {currency.code}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {isRTL ? currency.nameAr : currency.name}
                    </p>
                    <p className="text-xs text-gray-500">{currency.rate}</p>
                  </div>
                </div>
                {currency.isDefault && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    {isRTL ? 'افتراضي' : 'Default'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'language' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isRTL ? 'اللغات' : 'Languages'}
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇸🇦</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">العربية</p>
                  <p className="text-xs text-gray-500">Arabic</p>
                </div>
              </div>
              {locale === 'ar' && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {isRTL ? 'نشط' : 'Active'}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇬🇧</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">English</p>
                  <p className="text-xs text-gray-500">الإنجليزية</p>
                </div>
              </div>
              {locale === 'en' && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {isRTL ? 'نشط' : 'Active'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
