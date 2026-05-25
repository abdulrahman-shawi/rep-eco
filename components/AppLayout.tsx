'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  Calculator,
  Briefcase,
  Users,
  Factory,
  PieChart,
  BarChart3,
  UserCircle,
  Truck,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Globe,
  Landmark,
  ChevronRight,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  locale: 'ar' | 'en';
  messages: any;
}

export function AppLayout({ children, locale, messages }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const isRTL = locale === 'ar';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isLoginPage = pathname.includes('/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/login`);
    router.refresh();
  };

  const switchLang = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const menuItems = [
    { href: `/${locale}/dashboard`, icon: LayoutDashboard, label: messages.app.dashboard },
    { href: `/${locale}/inventory`, icon: Package, label: messages.app.inventory },
    { href: `/${locale}/purchases`, icon: ShoppingCart, label: messages.app.purchases },
    { href: `/${locale}/sales`, icon: CreditCard, label: messages.app.sales },
    { href: `/${locale}/accounting`, icon: Calculator, label: messages.app.accounting },
    { href: `/${locale}/projects`, icon: Briefcase, label: messages.app.projects },
    { href: `/${locale}/hr`, icon: Users, label: messages.app.hr },
    { href: `/${locale}/manufacturing`, icon: Factory, label: messages.app.manufacturing },
    { href: `/${locale}/cost-centers`, icon: PieChart, label: messages.app.costCenters },
    { href: `/${locale}/reports`, icon: BarChart3, label: messages.app.reports },
    { href: `/${locale}/customers`, icon: UserCircle, label: messages.app.customers },
    { href: `/${locale}/suppliers`, icon: Truck, label: messages.app.suppliers },
    { href: `/${locale}/users`, icon: Users, label: messages.app.users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'font-sans' : ''}`}>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Building2 className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-lg">ERP</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={switchLang}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-64 bg-white dark:bg-gray-800 border-${
          isRTL ? 'l' : 'r'
        } border-gray-200 dark:border-gray-700 z-50 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen
            ? 'translate-x-0'
            : isRTL
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">ERP</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.company?.name || 'Company'}
                </p>
              </div>
            </div>
            <button
              onClick={switchLang}
              className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title={locale === 'ar' ? 'English' : 'العربية'}
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{messages.app.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-200 lg:mr-0 ${
          isRTL ? 'lg:pr-64' : 'lg:pl-64'
        }`}
      >
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
