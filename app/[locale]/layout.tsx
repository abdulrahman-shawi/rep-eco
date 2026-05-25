import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { AppLayout } from '@/components/AppLayout';
import { getMessages } from '@/lib/i18n';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ERP System',
  description: 'Integrated ERP & E-Commerce System',
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = getMessages(locale as 'ar' | 'en');
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={inter.className}>
        <AppLayout locale={locale as 'ar' | 'en'} messages={messages}>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
