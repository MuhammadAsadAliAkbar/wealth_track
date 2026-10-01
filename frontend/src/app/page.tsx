'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  PieChart,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 shadow-lg shadow-primary-200">
            <Wallet className="h-6 w-6 text-white" />
          </div>

          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 text-slate-900">

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-5 py-3 shadow-sm backdrop-blur-md">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 shadow-md shadow-primary-200">
              <Wallet className="h-5 w-5 text-white" />
            </div>

            <div>
              <span className="block text-lg font-bold tracking-tight text-slate-900">
                WealthTrack
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:block">
                Personal Finance
              </span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="btn-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm shadow-md shadow-primary-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="container mx-auto px-6 pb-20 pt-16 text-center md:pt-24">

        {/* Small badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-4 py-2 text-sm font-medium text-primary-700 shadow-sm backdrop-blur">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          Simple. Smart. Financially focused.
        </div>

        {/* Heading */}
        <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
          Master Your Money.
          <br />
          <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            Track Every Asset.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mb-9 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
          Complete budgeting and asset management in one place.
          Track income, expenses, budgets and assets while keeping
          your financial picture organized.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="btn-primary flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold shadow-lg shadow-primary-200 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Start Free Today
            <ArrowRight className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Easy to get started
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-5 text-left md:grid-cols-3">

          {/* Smart Budgeting */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-xl hover:shadow-slate-200/50">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
              <TrendingUp className="h-6 w-6" />
            </div>

            <h3 className="mb-2 text-lg font-bold text-slate-900">
              Smart Budgeting
            </h3>

            <p className="text-sm leading-6 text-slate-600">
              Set monthly budgets by category, monitor spending and
              keep your financial goals organized.
            </p>
          </div>

          {/* Asset Tracking */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-slate-200/50">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <PieChart className="h-6 w-6" />
            </div>

            <h3 className="mb-2 text-lg font-bold text-slate-900">
              Asset Tracking
            </h3>

            <p className="text-sm leading-6 text-slate-600">
              Manage real estate, vehicles, investments and other
              assets while tracking your overall financial position.
            </p>
          </div>

          {/* Analytics */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl hover:shadow-slate-200/50">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <Shield className="h-6 w-6" />
            </div>

            <h3 className="mb-2 text-lg font-bold text-slate-900">
              Powerful Analytics
            </h3>

            <p className="text-sm leading-6 text-slate-600">
              Explore forecasts, financial health insights and asset
              projections powered by your financial data.
            </p>
          </div>

        </div>

        {/* Bottom trust strip */}
        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-wider text-slate-400">
          <span>Income Tracking</span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
          <span>Expense Management</span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
          <span>Budget Planning</span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
          <span>Asset Management</span>
        </div>

      </main>
    </div>
  );
}