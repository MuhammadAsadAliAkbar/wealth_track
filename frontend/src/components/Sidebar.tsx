'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Building2,
  Tags,
  BarChart3,
  LogOut,
  Wallet,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import clsx from 'clsx';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/transactions',
    label: 'Transactions',
    icon: ArrowLeftRight,
  },
  {
    href: '/dashboard/budgets',
    label: 'Budgets',
    icon: PiggyBank,
  },
  {
    href: '/dashboard/assets',
    label: 'Assets',
    icon: Building2,
  },
  {
    href: '/dashboard/categories',
    label: 'Categories',
    icon: Tags,
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 text-white">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 shadow-lg shadow-primary-900/30">
          <Wallet className="h-5 w-5 text-white" />
        </div>

        <div>
          <span className="block text-lg font-bold tracking-tight">
            WealthTrack
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Finance Manager
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 p-4">
        <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'group relative flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all duration-200',
                active
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-950/30'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-300" />
              )}

              <div
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                  active
                    ? 'bg-white/15'
                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                )}
              >
                <Icon className="h-[17px] w-[17px]" />
              </div>

              <span className="text-sm font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-slate-800 p-4">

        <div className="mb-3 rounded-xl bg-slate-800/60 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-200">
                {user?.name}
              </p>

              <p className="truncate text-xs text-slate-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 transition-colors group-hover:bg-red-500/10">
            <LogOut className="h-[17px] w-[17px]" />
          </div>

          <span className="text-sm font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}