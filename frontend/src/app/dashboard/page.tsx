
'use client';

import { useEffect, useState } from 'react';
import { transactionAPI, assetAPI, budgetAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [networth, setNetworth] = useState<any>(null);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, nwRes, budgetRes] = await Promise.all([
          transactionAPI.stats(),
          assetAPI.networth(),
          budgetAPI.getAll(),
        ]);

        setStats(statsRes.data.data);
        setNetworth(nwRes.data.data);
        setBudgets(budgetRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: user?.currency || 'PKR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
          <p className="text-sm text-slate-500">
            Loading your financial overview...
          </p>
        </div>
      </div>
    );
  }

  const pieData =
    stats?.byCategory?.map((c: any) => ({
      name: c.name,
      value: c.total,
      color: c.color,
    })) || [];

  const statCards = [
    {
      title: 'Income',
      subtitle: 'This Month',
      value: formatCurrency(stats?.income),
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-600',
      accent: 'from-emerald-500/10',
      arrow: ArrowUpRight,
    },
    {
      title: 'Expenses',
      subtitle: 'This Month',
      value: formatCurrency(stats?.expense),
      icon: TrendingDown,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      valueColor: 'text-red-600',
      accent: 'from-red-500/10',
      arrow: ArrowDownRight,
    },
    {
      title: 'Balance',
      subtitle: 'Available Balance',
      value: formatCurrency(stats?.balance),
      icon: Wallet,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      valueColor: 'text-primary-600',
      accent: 'from-primary-500/10',
      arrow: ArrowUpRight,
    },
    {
      title: 'Net Worth',
      subtitle: 'Total Assets',
      value: formatCurrency(networth?.totalNetWorth),
      icon: Building2,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      valueColor: 'text-indigo-600',
      accent: 'from-indigo-500/10',
      arrow: ArrowUpRight,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary-100/60 blur-3xl" />

        <div className="relative">
          <p className="mb-1 text-sm font-medium text-primary-600">
            Financial Overview
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s a quick overview of your finances.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const Arrow = stat.arrow;

          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              {/* Soft background glow */}
              <div
                className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${stat.accent} to-transparent blur-2xl`}
              />

              <div className="relative">
                <div className="mb-5 flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-primary-50 group-hover:text-primary-600">
                    <Arrow className="h-3.5 w-3.5" />
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p
                  className={`mt-1 text-2xl font-bold tracking-tight ${stat.valueColor}`}
                >
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Expense Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Expense Breakdown
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Spending by category this month
              </p>
            </div>

            <div className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600">
              Monthly
            </div>
          </div>

          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={290}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="none"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || '#6366f1'}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[290px] flex-col items-center justify-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <TrendingDown className="h-5 w-5 text-slate-400" />
              </div>

              <p className="text-sm font-medium text-slate-600">
                No expense data yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Add transactions to see your breakdown
              </p>
            </div>
          )}
        </div>

        {/* Budget Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Budget Progress
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Track your monthly spending limits
              </p>
            </div>

            <div className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
              {budgets.length} {budgets.length === 1 ? 'Budget' : 'Budgets'}
            </div>
          </div>

          {budgets.length > 0 ? (
            <div className="max-h-[290px] space-y-5 overflow-y-auto pr-1">
              {budgets.map((b: any) => {
                const percentage = Math.min(
                  Math.max(b.percentage || 0, 0),
                  100
                );

                const isOver = b.percentage > 100;
                const isWarning =
                  b.percentage > 80 && b.percentage <= 100;

                const progressColor = isOver
                  ? 'bg-red-500'
                  : isWarning
                  ? 'bg-amber-500'
                  : 'bg-emerald-500';

                return (
                  <div key={b._id}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-700">
                          {b.category?.name}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 text-xs font-medium ${
                          isOver
                            ? 'text-red-600'
                            : isWarning
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {formatCurrency(b.spent)} /{' '}
                        {formatCurrency(b.amount)}
                      </span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${progressColor} transition-all duration-700`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <div className="mt-1.5 flex justify-between">
                      <span className="text-[11px] text-slate-400">
                        {Math.round(b.percentage || 0)}% used
                      </span>

                      {isOver && (
                        <span className="text-[11px] font-medium text-red-500">
                          Over budget
                        </span>
                      )}

                      {isWarning && (
                        <span className="text-[11px] font-medium text-amber-500">
                          Near limit
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-[290px] flex-col items-center justify-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Wallet className="h-5 w-5 text-slate-400" />
              </div>

              <p className="text-sm font-medium text-slate-600">
                No budgets set
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Create a budget to start tracking your spending
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

