'use client';

import { useEffect, useState } from 'react';
import {
  transactionAPI,
  assetAPI,
  budgetAPI,
  pythonAPI,
} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Activity,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  LineChart,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();

  const [forecast, setForecast] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [projection, setProjection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [txRes, statsRes, budgetRes, assetRes] = await Promise.all([
          transactionAPI.getAll({ limit: 500 }),
          transactionAPI.stats(),
          budgetAPI.getAll(),
          assetAPI.getAll(),
        ]);

        const transactions = txRes.data.data.map((t: any) => ({
          type: t.type,
          amount: t.amount,
          category: t.category?.name || 'Other',
          date: t.date,
        }));

        // Forecast
        try {
          const fRes = await pythonAPI.forecast({
            transactions,
            months_ahead: 3,
          });

          setForecast(fRes.data);
        } catch {
          console.log('Python forecast service unavailable');
        }

        // Budget health
        try {
          const hRes = await pythonAPI.budgetHealth({
            income: statsRes.data.data.income,
            expense: statsRes.data.data.expense,
            budgets: budgetRes.data.data.map((b: any) => ({
              amount: b.amount,
              spent: b.spent,
            })),
          });

          setHealth(hRes.data);
        } catch {
          console.log('Python health service unavailable');
        }

        // Asset projection
        try {
          const pRes = await pythonAPI.assetProjection({
            assets: assetRes.data.data.map((a: any) => ({
              name: a.name,
              type: a.type,
              current_value: a.currentValue,
              purchase_price: a.purchasePrice,
              depreciation_rate: a.depreciationRate,
            })),
            years: 5,
          });

          setProjection(pRes.data);
        } catch {
          console.log('Python projection service unavailable');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: user?.currency || 'PKR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  const getHealthConfig = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Excellent',
        icon: CheckCircle2,
        text: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        ring: '#22c55e',
      };
    }

    if (score >= 60) {
      return {
        label: 'Good',
        icon: Activity,
        text: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        ring: '#eab308',
      };
    }

    return {
      label: 'Needs Attention',
      icon: AlertTriangle,
      text: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
      ring: '#ef4444',
    };
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-11 w-11 rounded-full border-4 border-slate-200 border-t-primary-600 animate-spin" />
          <p className="text-sm text-slate-500">
            Preparing your financial analytics...
          </p>
        </div>
      </div>
    );
  }

  const healthConfig = health
    ? getHealthConfig(Number(health.score || 0))
    : null;

  const HealthIcon = healthConfig?.icon;

  return (
    <div className="space-y-7 pb-8">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-50 blur-2xl" />
        <div className="absolute -bottom-20 left-1/3 h-32 w-32 rounded-full bg-indigo-50 blur-2xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <BrainCircuit className="h-5 w-5" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                Smart Insights
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Financial Analytics
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Understand your financial health, forecast upcoming activity,
              and explore long-term asset projections.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Python Analytics Connected
          </div>
        </div>
      </div>

      {/* =====================================================
          QUICK OVERVIEW
      ====================================================== */}
      {(health || forecast || projection) && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {health && (
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Activity className="h-5 w-5" />
                </div>

                <span className="text-xs font-medium text-slate-400">
                  Budget Health
                </span>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900">
                  {health.score}
                  <span className="ml-1 text-sm font-medium text-slate-400">
                    / 100
                  </span>
                </p>

                <p className={`mt-1 text-sm font-medium ${healthConfig?.text}`}>
                  {health.status}
                </p>
              </div>
            </div>
          )}

          {forecast && (
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <LineChart className="h-5 w-5" />
                </div>

                <span className="text-xs font-medium text-slate-400">
                  Forecast
                </span>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900">
                  3 Months
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Based on {forecast.historical_months} months of history
                </p>
              </div>
            </div>
          )}

          {projection && (
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <TrendingUp className="h-5 w-5" />
                </div>

                <span className="text-xs font-medium text-slate-400">
                  Asset Outlook
                </span>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900">
                  5 Years
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Long-term asset projection
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          BUDGET HEALTH
      ====================================================== */}
      {health && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary-600" />
                <h2 className="font-semibold text-slate-900">
                  Budget Health Score
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                A snapshot of your current spending and savings health.
              </p>
            </div>

            {healthConfig && (
              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${healthConfig.bg} ${healthConfig.border} ${healthConfig.text}`}
              >
                {HealthIcon && <HealthIcon className="h-3.5 w-3.5" />}
                {healthConfig.label}
              </div>
            )}
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[180px_1fr] lg:items-center">

            {/* Score Circle */}
            <div className="flex justify-center">
              <div className="relative h-36 w-36">
                <svg
                  className="h-full w-full -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />

                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={healthConfig?.ring || '#6366f1'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${health.score}, 100`}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900">
                    {health.score}
                  </span>
                  <span className="text-xs text-slate-400">
                    out of 100
                  </span>
                </div>
              </div>
            </div>

            {/* Health Details */}
            <div>
              <div className="grid gap-3 sm:grid-cols-2">

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Wallet className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      Financial Status
                    </span>
                  </div>

                  <p className="text-lg font-semibold text-slate-900">
                    {health.status}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      Savings Rate
                    </span>
                  </div>

                  <p className="text-lg font-semibold text-slate-900">
                    {health.savings_rate}%
                  </p>
                </div>

              </div>

              {health.tips?.length > 0 && (
                <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50/50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary-600" />
                    <span className="text-sm font-semibold text-slate-800">
                      Smart Tips
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {health.tips.map((tip: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FORECAST
      ====================================================== */}
      {forecast && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <BarChart3 className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      3-Month Forecast
                    </h2>
                    <p className="text-xs text-slate-500">
                      Predicted income and expenses
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                  <p className="text-[11px] text-emerald-600">
                    Avg Income
                  </p>
                  <p className="text-sm font-semibold text-emerald-700">
                    {formatCurrency(forecast.avg_income)}
                  </p>
                </div>

                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2">
                  <p className="text-[11px] text-red-600">
                    Avg Expense
                  </p>
                  <p className="text-sm font-semibold text-red-700">
                    {formatCurrency(forecast.avg_expense)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Info className="h-3.5 w-3.5" />
              Based on {forecast.historical_months} months of historical data
            </div>
          </div>

          <div className="p-5">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={forecast.forecast}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                  }}
                />

                <Legend />

                <Bar
                  dataKey="predicted_income"
                  name="Predicted Income"
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="predicted_expense"
                  name="Predicted Expense"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* =====================================================
          ASSET PROJECTION
      ====================================================== */}
      {projection && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <TrendingUp className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  5-Year Asset Projection
                </h2>

                <p className="text-sm text-slate-500">
                  Estimated long-term value of your assets.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">

            {/* Projection Summary */}
            <div className="grid gap-4 md:grid-cols-3">

              <div className="group rounded-xl border border-slate-200 bg-slate-50/60 p-5 transition hover:border-slate-300 hover:bg-white">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                    <Wallet className="h-4 w-4" />
                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    Today
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-500">
                  Current Total
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatCurrency(projection.total_current_value)}
                </p>
              </div>

              <div className="group rounded-xl border border-violet-100 bg-violet-50/50 p-5 transition hover:border-violet-200 hover:bg-violet-50">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">
                    <Target className="h-4 w-4" />
                  </div>

                  <span className="text-xs font-medium text-violet-500">
                    5 Years
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-500">
                  Projected Value
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatCurrency(projection.total_projected_value)}
                </p>
              </div>

              <div
                className={`rounded-xl border p-5 transition ${
                  projection.net_change >= 0
                    ? 'border-emerald-100 bg-emerald-50/50 hover:border-emerald-200'
                    : 'border-red-100 bg-red-50/50 hover:border-red-200'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ${
                      projection.net_change >= 0
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    }`}
                  >
                    {projection.net_change >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      projection.net_change >= 0
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    }`}
                  >
                    Net Change
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-500">
                  Estimated Change
                </p>

                <p
                  className={`mt-1 text-xl font-bold ${
                    projection.net_change >= 0
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {projection.net_change >= 0 ? '+' : ''}
                  {formatCurrency(projection.net_change)}
                </p>
              </div>

            </div>

            {/* Assets */}
            {projection.assets?.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Projected Assets
                  </h3>

                  <span className="text-xs text-slate-400">
                    {projection.assets.length} assets
                  </span>
                </div>

                <div className="space-y-3">
                  {projection.assets.map((a: any) => (
                    <div
                      key={a.name}
                      className="group flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                          <Wallet className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {a.name}
                          </p>

                          <p className="mt-0.5 text-xs capitalize text-slate-500">
                            {a.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-8 sm:justify-end">
                        <div className="text-right">
                          <p className="text-xs text-slate-400">
                            Final Value
                          </p>

                          <p className="font-semibold text-slate-900">
                            {formatCurrency(a.final_value)}
                          </p>
                        </div>

                        <div
                          className={`min-w-[100px] text-right ${
                            a.total_change >= 0
                              ? 'text-emerald-600'
                              : 'text-red-600'
                          }`}
                        >
                          <div className="flex items-center justify-end gap-1">
                            {a.total_change >= 0 ? (
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowDownRight className="h-3.5 w-3.5" />
                            )}

                            <span className="text-xs font-medium">
                              {a.total_change >= 0 ? '+' : ''}
                              {formatCurrency(a.total_change)}
                            </span>
                          </div>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Total change
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          EMPTY / SERVICE UNAVAILABLE
      ====================================================== */}
      {!forecast && !health && !projection && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <BrainCircuit className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            Analytics Service Unavailable
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
            The Python analytics service is currently not running.
            Start the service to generate forecasts, budget health,
            and asset projections.
          </p>

          <div className="mx-auto mt-5 max-w-fit rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
            <p className="mb-1 text-xs font-medium text-slate-400">
              Start command
            </p>

            <code className="break-all text-xs text-slate-700">
              cd python-service && uvicorn app.main:app --reload --port 8000
            </code>
          </div>
        </div>
      )}
    </div>
  );
}