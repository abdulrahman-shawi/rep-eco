'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileDown,
  FileUp,
  Printer,
  Download,
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Package,
} from 'lucide-react';

export type Column<T = any> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
};

type SortDirection = 'asc' | 'desc' | null;

interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  searchKeys?: string[];
  searchPlaceholder?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  showExport?: boolean;
  showImport?: boolean;
  showPrint?: boolean;
  showActions?: boolean;
  actions?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    custom?: (row: T) => React.ReactNode;
  };
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  rowKey?: string;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  locale?: 'ar' | 'en';
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = true,
  searchKeys,
  searchPlaceholder,
  pageSizeOptions = [5, 10, 25, 50, 100],
  defaultPageSize = 10,
  showExport = true,
  showImport = true,
  showPrint = true,
  showActions = true,
  actions = { edit: true, delete: true, view: false },
  onEdit,
  onDelete,
  onView,
  rowKey = 'id',
  emptyMessage = 'لا توجد بيانات',
  loading = false,
  className = '',
  locale = 'ar',
}: DataTableProps<T>) {
  const isRTL = locale === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Search
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row) => {
      const keys = searchKeys || columns.map((c) => c.key);
      return keys.some((key) => {
        const val = row[key];
        if (val == null) return false;
        return String(val).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchKeys, columns]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return sortDir === 'asc' ? -1 : 1;
      if (bVal == null) return sortDir === 'asc' ? 1 : -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((prev) => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
        if (sortDir === 'desc') setSortKey(null);
      } else {
        setSortKey(key);
        setSortDir('asc');
      }
    },
    [sortKey, sortDir]
  );

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Export helpers
  const getExportData = () => {
    const exportCols = columns.filter((c) => c.key !== 'actions');
    const headers = exportCols.map((c) => c.label).join(',');
    const rows = sortedData.map((row) =>
      exportCols
        .map((c) => {
          const val = row[c.key];
          if (val == null) return '';
          const str = String(val).replace(/"/g, '""');
          return str.includes(',') || str.includes('\n') || str.includes('"') ? `"${str}"` : str;
        })
        .join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const exportCSV = () => {
    const csv = getExportData();
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  const exportExcel = () => {
    const csv = getExportData();
    const blob = new Blob(['\uFEFF' + csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `export_${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const html = `
      <html dir="${isRTL ? 'rtl' : 'ltr'}">
      <head><title>${title || 'Print'}</title>
      <style>
        body{font-family:Arial,sans-serif;padding:20px}
        table{width:100%;border-collapse:collapse}
        th,td{border:1px solid #ddd;padding:8px;text-align:${isRTL ? 'right' : 'left'}}
        th{background:#f3f4f6;font-weight:bold}
        tr:nth-child(even){background:#f9fafb}
      </style></head>
      <body>
        <h2>${title || ''}</h2>
        <table>
          <thead><tr>${columns.filter((c) => c.key !== 'actions').map((c) => `<th>${c.label}</th>`).join('')}</tr></thead>
          <tbody>
            ${sortedData.map((row) => `<tr>${columns.filter((c) => c.key !== 'actions').map((c) => `<td>${row[c.key] ?? ''}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
    setShowExportMenu(false);
  };

  // Import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = String(event.target?.result || '');
      alert(isRTL ? 'تم قراءة الملف. يمكنك معالجة البيانات هنا.' : 'File read. You can process data here.');
      console.log('Imported data:', text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Title & Count */}
          <div className="flex items-center gap-3">
            {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>}
            <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full font-medium">
              {sortedData.length} {isRTL ? 'سجل' : 'records'}
            </span>
          </div>

          {/* Search */}
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder={searchPlaceholder || (isRTL ? 'بحث...' : 'Search...')}
                className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isRTL ? 'left-3' : 'right-3'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showImport && (
              <label className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                <FileUp className="w-4 h-4" />
                <span>{isRTL ? 'استيراد' : 'Import'}</span>
                <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleImport} />
              </label>
            )}

            {/* Export Dropdown */}
            {showExport && (
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{isRTL ? 'تصدير' : 'Export'}</span>
                </button>
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden`}
                    >
                      <button onClick={exportCSV} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Download className="w-4 h-4" />
                        CSV
                      </button>
                      <button onClick={exportExcel} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Excel
                      </button>
                      {showPrint && (
                        <button onClick={handlePrint} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <Printer className="w-4 h-4" />
                          {isRTL ? 'طباعة' : 'Print'}
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap select-none ${
                    col.sortable !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/80' : ''
                  } ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  <div className={`flex items-center gap-1 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''}`}>
                    {col.label}
                    {col.sortable !== false && sortKey === col.key && (
                      sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> :
                      sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> :
                      <ArrowUpDown className="w-3 h-3 opacity-40" />
                    )}
                    {col.sortable !== false && sortKey !== col.key && (
                      <ArrowUpDown className="w-3 h-3 opacity-20" />
                    )}
                  </div>
                </th>
              ))}
              {showActions && (actions?.edit || actions?.delete || actions?.view || actions?.custom) && (
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                  {isRTL ? 'إجراءات' : 'Actions'}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">{emptyMessage}</p>
                </td>
              </tr>
            )}
            {paginatedData.map((row, index) => (
              <motion.tr
                key={row[rowKey] ?? index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    {col.render ? (
                      col.render(row)
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">
                        {row[col.key] ?? '-'}
                      </span>
                    )}
                  </td>
                ))}
                {showActions && (actions?.edit || actions?.delete || actions?.view || actions?.custom) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {actions?.view && onView && (
                        <button
                          onClick={() => onView(row)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title={isRTL ? 'عرض' : 'View'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {actions?.edit && onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                          title={isRTL ? 'تعديل' : 'Edit'}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {actions?.delete && onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title={isRTL ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {actions?.custom?.(row)}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          {/* Page size selector */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{isRTL ? 'عرض' : 'Show'}</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>{isRTL ? 'سجل في الصفحة' : 'entries per page'}</span>
          </div>

          {/* Info */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isRTL
              ? `عرض ${startIndex + 1} إلى ${Math.min(startIndex + pageSize, sortedData.length)} من ${sortedData.length} سجل`
              : `Showing ${startIndex + 1} to ${Math.min(startIndex + pageSize, sortedData.length)} of ${sortedData.length} entries`}
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safePage <= 1}
              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce<number[]>((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push(-1);
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === -1 ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                        p === safePage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
