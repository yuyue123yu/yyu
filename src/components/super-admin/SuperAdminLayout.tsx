'use client';

import { ReactNode } from 'react';
import SuperAdminNav from './SuperAdminNav';
import SuperAdminHeader from './SuperAdminHeader';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SuperAdminHeader />

      <div className="flex">
        {/* Sidebar Navigation */}
        <SuperAdminNav />

        {/* Main Content */}
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
