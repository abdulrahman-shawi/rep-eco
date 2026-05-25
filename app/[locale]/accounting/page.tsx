'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Calculator, TreePine, BookOpen, FileText, Scale } from 'lucide-react';
import { getMessages } from '@/lib/i18n';

export default function AccountingPage() {
  const params = useParams();
  const locale = params.locale as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const t = getMessages(locale);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'accounts' | 'entries'>('accounts');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [entryForm, setEntryForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nameEn: '',
    type: 'asset',
    parentId: '',
  });
  const [entryData, setEntryData] = useState({
    entryNumber: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    voucherType: 'journal',
    items: [] as any[],
  });

  useEffect(() => {
    fetchAccounts();
    fetchEntries();
  }, []);

  const fetchAccounts = async () => {
    const res = await fetch('/api/accounting/accounts');
    const data = await res.json();
    setAccounts(data.accounts || []);
    setLoading(false);
  };

  const fetchEntries = async () => {
    const res = await fetch('/api/accounting/journal-entries');
    const data = await res.json();
    setEntries(data.entries || []);
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/accounting/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setShowForm(false);
    fetchAccounts();
  };

  const addEntryItem = () => {
    setEntryData({
      ...entryData,
      items: [...entryData.items, { accountId: '', debit: 0, credit: 0, description: '' }],
    });
  };

  const updateEntryItem = (index: number, field: string, value: any) => {
    const newItems = [...entryData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setEntryData({ ...entryData, items: newItems });
  };

  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/accounting/journal-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData),
    });
    setEntryForm(false);
    fetchEntries();
  };

  const getAccountTypeLabel = (type: string) => {
    const types: any = {
      asset: t.accounting.assets,
      liability: t.accounting.liabilities,
      equity: t.accounting.equity,
      revenue: t.accounting.revenue,
      expense: t.accounting.expenses,
    };
    return types[type] || type;
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.app.accounting}</h1>
        <div className="flex gap-2">
          {activeTab === 'accounts' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              {isRTL ? 'إضافة حساب' : 'Add Account'}
            </button>
          )}
          {activeTab === 'entries' && (
            <button
              onClick={() => setEntryForm(!entryForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              {isRTL ? 'قيد جديد' : 'New Entry'}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
        {(['accounts', 'entries'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {tab === 'accounts' && t.accounting.chartOfAccounts}
            {tab === 'entries' && t.accounting.journalEntries}
          </button>
        ))}
      </div>

      {/* Account Form */}
      {showForm && activeTab === 'accounts' && (
        <form
          onSubmit={handleAccountSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.accounting.accountCode}</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.accounting.accountName}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.accounting.accountType}</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="asset">{t.accounting.assets}</option>
                <option value="liability">{t.accounting.liabilities}</option>
                <option value="equity">{t.accounting.equity}</option>
                <option value="revenue">{t.accounting.revenue}</option>
                <option value="expense">{t.accounting.expenses}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {t.app.save}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              {t.app.cancel}
            </button>
          </div>
        </form>
      )}

      {/* Entry Form */}
      {entryForm && activeTab === 'entries' && (
        <form
          onSubmit={handleEntrySubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.accounting.entryNumber}</label>
              <input
                type="text"
                required
                value={entryData.entryNumber}
                onChange={(e) => setEntryData({ ...entryData, entryNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.app.date}</label>
              <input
                type="date"
                value={entryData.date}
                onChange={(e) => setEntryData({ ...entryData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.accounting.voucherType}</label>
              <select
                value={entryData.voucherType}
                onChange={(e) => setEntryData({ ...entryData, voucherType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="journal">{t.accounting.journalEntries}</option>
                <option value="payment">{t.accounting.paymentVoucher}</option>
                <option value="receipt">{t.accounting.receiptVoucher}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.accounting.description}</label>
            <input
              type="text"
              value={entryData.description}
              onChange={(e) => setEntryData({ ...entryData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">{t.accounting.journalEntries}</label>
              <button
                type="button"
                onClick={addEntryItem}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + {t.app.add}
              </button>
            </div>
            {entryData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2">
                <select
                  value={item.accountId}
                  onChange={(e) => updateEntryItem(index, 'accountId', parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="">{isRTL ? 'اختر حساب' : 'Select account'}</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code} - {a.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder={t.accounting.debit}
                  value={item.debit}
                  onChange={(e) => updateEntryItem(index, 'debit', parseFloat(e.target.value))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
                <input
                  type="number"
                  placeholder={t.accounting.credit}
                  value={item.credit}
                  onChange={(e) => updateEntryItem(index, 'credit', parseFloat(e.target.value))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
                <input
                  type="text"
                  placeholder={t.accounting.description}
                  value={item.description}
                  onChange={(e) => updateEntryItem(index, 'description', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {t.app.save}
            </button>
            <button
              type="button"
              onClick={() => setEntryForm(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              {t.app.cancel}
            </button>
          </div>
        </form>
      )}

      {/* Accounts Table */}
      {activeTab === 'accounts' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t.accounting.accountCode}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t.accounting.accountName}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t.accounting.accountType}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t.accounting.balance}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {account.code}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <span style={{ paddingRight: `${(account.level - 1) * 20}px` }}>
                      {account.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        account.type === 'asset'
                          ? 'bg-blue-100 text-blue-700'
                          : account.type === 'liability'
                          ? 'bg-red-100 text-red-700'
                          : account.type === 'equity'
                          ? 'bg-purple-100 text-purple-700'
                          : account.type === 'revenue'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {getAccountTypeLabel(account.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {account.balance?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Entries Table */}
      {activeTab === 'entries' && (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {entry.entryNumber}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      entry.isPosted
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {entry.isPosted ? (isRTL ? 'مرحل' : 'Posted') : isRTL ? 'غير مرحل' : 'Draft'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{entry.voucherType}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{entry.description}</p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="px-3 py-2 text-left text-xs">{t.accounting.accountName}</th>
                      <th className="px-3 py-2 text-right text-xs">{t.accounting.debit}</th>
                      <th className="px-3 py-2 text-right text-xs">{t.accounting.credit}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.items?.map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="px-3 py-2">{item.account?.name}</td>
                        <td className="px-3 py-2 text-right">{item.debit > 0 ? item.debit.toLocaleString() : ''}</td>
                        <td className="px-3 py-2 text-right">{item.credit > 0 ? item.credit.toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-gray-100 dark:bg-gray-600/50">
                      <td className="px-3 py-2">{isRTL ? 'الإجمالي' : 'Total'}</td>
                      <td className="px-3 py-2 text-right">{entry.totalDebit?.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right">{entry.totalCredit?.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
