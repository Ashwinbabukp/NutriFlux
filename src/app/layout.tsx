import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import AppLayout from '@/components/AppLayout';

export const metadata: Metadata = {
  title: 'NutriFlux',
  description: 'AI food tracker with daily nutrition totals and meal logging.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
