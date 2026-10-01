'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f6f8fb] flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Logo / Loader */}
          <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-[20px] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-slate-200" />

            <div className="absolute h-9 w-9 rounded-full border-[3px] border-slate-200 border-t-primary-600 animate-spin" />

            <div className="relative h-3 w-3 rounded-full bg-primary-600" />
          </div>

          <h2 className="text-sm font-semibold tracking-tight text-slate-800">
            WealthTrack
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Preparing your financial workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">

      {/* =====================================================
          APP SHELL
      ====================================================== */}
      <div className="flex min-h-screen">

        {/* ===================================================
            SIDEBAR
        ==================================================== */}
        <aside className="relative z-30 shrink-0">
          <Sidebar />
        </aside>

        {/* ===================================================
            MAIN AREA
        ==================================================== */}
        <div className="relative min-w-0 flex-1">

          {/* Very subtle background gradient */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary-100/20 blur-[100px]" />
            <div className="absolute -bottom-40 left-[35%] h-[450px] w-[450px] rounded-full bg-indigo-100/20 blur-[100px]" />
          </div>

          {/* =================================================
              TOP BAR
          ================================================== */}
          <header className="sticky top-0 z-20 px-4 pt-4 sm:px-6 lg:px-8">

            <div className="mx-auto flex h-[64px] max-w-[1600px] items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl sm:px-5">

              {/* Left */}
              <div className="flex items-center gap-3">
                <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 sm:flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4.5 w-4.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13h4l3-9 4 16 3-7h4"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Financial Workspace
                  </p>

                  <p className="hidden text-[11px] text-slate-400 sm:block">
                    Manage your finances with clarity
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">

                {/* Online Status */}
                <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-medium text-emerald-700">
                    All systems operational
                  </span>
                </div>

                {/* User */}
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>

                  <div className="hidden min-w-0 sm:block">
                    <p className="max-w-[130px] truncate text-xs font-semibold text-slate-700">
                      {user?.name || 'User'}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Personal Account
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* =================================================
              PAGE CONTENT
          ================================================== */}
          <main className="relative z-10 px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:pt-6">

            <div className="mx-auto w-full max-w-[1600px]">

              {/* Content Surface */}
              <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_8px_40px_rgba(15,23,42,0.045)] backdrop-blur-sm sm:p-6 lg:p-7">

                {children}

              </div>

            </div>
          </main>

          {/* =================================================
              FOOTER
          ================================================== */}
          <footer className="relative z-10 px-4 pb-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between border-t border-slate-200/70 pt-4 text-[11px] text-slate-400">
              <span>WealthTrack</span>

              <span>
                Personal Finance Dashboard
              </span>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}