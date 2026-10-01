'use client';

import { useEffect, useState } from 'react';
import { budgetAPI, categoryAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {
  Plus,
  Trash2,
  Wallet,
  CalendarDays,
  X,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export default function BudgetsPage() {
  const { user } = useAuth();

  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const now = new Date();

  const [form, setForm] = useState({
    category: '',
    amount: '',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const fetchData = async () => {
    try {
      const [bRes, cRes] = await Promise.all([
        budgetAPI.getAll(),
        categoryAPI.getAll({ type: 'expense' }),
      ]);

      setBudgets(bRes.data.data);
      setCategories(cRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: user?.currency || 'PKR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await budgetAPI.set({
        ...form,
        amount: Number(form.amount),
      });

      toast.success('Budget saved');
      setShowForm(false);

      setForm({
        category: '',
        amount: '',
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });

      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete budget?')) return;

    try {
      await budgetAPI.delete(id);
      toast.success('Deleted');
      fetchData();
    } catch {
      toast.error('Failed');
    }
  };

  const getBudgetStatus = (percentage: number) => {
    if (percentage > 100) {
      return {
        label: 'Over budget',
        icon: AlertTriangle,
        text: 'text-red-600',
        bg: 'bg-red-50',
        bar: 'bg-red-500',
      };
    }

    if (percentage > 80) {
      return {
        label: 'Near limit',
        icon: AlertTriangle,
        text: 'text-amber-600',
        bg: 'bg-amber-50',
        bar: 'bg-amber-500',
      };
    }

    return {
      label: 'On track',
      icon: CheckCircle2,
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      bar: 'bg-emerald-500',
    };
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600" />
          <p className="text-sm text-slate-500">Loading budgets...</p>
        </div>
      </div>
    );
  }

  const totalBudget = budgets.reduce(
    (sum, budget) => sum + Number(budget.amount || 0),
    0
  );

  const totalSpent = budgets.reduce(
    (sum, budget) => sum + Number(budget.spent || 0),
    0
  );

  const totalRemaining = budgets.reduce(
    (sum, budget) => sum + Number(budget.remaining || 0),
    0
  );

  const overallPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                <Wallet className="h-5 w-5 text-primary-600" />
              </div>

              <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                Financial Planning
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Budgets
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Set spending limits and keep your expenses under control.
            </p>
          </div>

          <button
            className="btn-primary flex items-center justify-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <>
                <X className="h-4 w-4" />
                Close
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Set Budget
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          SUMMARY CARDS
      ========================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Budget */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Budget
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(totalBudget)}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Across {budgets.length} budget
                {budgets.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
              <Target className="h-5 w-5 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Spent
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(totalSpent)}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {overallPercentage.toFixed(0)}% of total budget
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Remaining */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Remaining
              </p>

              <h2
                className={`mt-2 text-2xl font-bold ${
                  totalRemaining >= 0
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {formatCurrency(Math.abs(totalRemaining))}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {totalRemaining >= 0
                  ? 'Available to spend'
                  : 'Over allocated budget'}
              </p>
            </div>

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                totalRemaining >= 0 ? 'bg-emerald-50' : 'bg-red-50'
              }`}
            >
              <Wallet
                className={`h-5 w-5 ${
                  totalRemaining >= 0
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ADD BUDGET FORM
      ========================================================= */}
      {showForm && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100">
                <Plus className="h-4 w-4 text-primary-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Create Budget
                </h2>

                <p className="text-xs text-slate-500">
                  Set a monthly spending limit for a category.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {/* Category */}
            <div>
              <label className="label">Category</label>

              <select
                className="input transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                required
              >
                <option value="">Select category</option>

                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="label">Budget Amount</label>

              <div className="relative">
                <input
                  type="number"
                  className="input pr-16 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value,
                    })
                  }
                  required
                  min="0"
                  step="0.01"
                  placeholder="0"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                  {user?.currency || 'PKR'}
                </span>
              </div>
            </div>

            {/* Month */}
            <div>
              <label className="label">Month</label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  className="input pl-10 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  value={form.month}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      month: Number(e.target.value),
                    })
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', {
                        month: 'long',
                      })}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="btn-primary flex-1 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Save Budget
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================
          BUDGET LIST
      ========================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your Budgets
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monitor spending against your monthly limits.
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {budgets.length} {budgets.length === 1 ? 'Budget' : 'Budgets'}
          </div>
        </div>

        {budgets.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {budgets.map((b) => {
              const percentage = Number(b.percentage || 0);
              const status = getBudgetStatus(percentage);
              const StatusIcon = status.icon;

              const categoryColor =
                b.category?.color || '#6366f1';

              return (
                <div
                  key={b._id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >
                  {/* Top accent */}
                  <div
                    className="absolute left-0 top-0 h-1 w-full"
                    style={{
                      backgroundColor: categoryColor,
                    }}
                  />

                  {/* Card Header */}
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${categoryColor}18`,
                        }}
                      >
                        <Wallet
                          className="h-5 w-5"
                          style={{
                            color: categoryColor,
                          }}
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {b.category?.name || 'Uncategorized'}
                        </h3>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5" />

                          {new Date(
                            0,
                            b.month - 1
                          ).toLocaleString('default', {
                            month: 'long',
                          })}{' '}
                          {b.year}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(b._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                      title="Delete budget"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Amounts */}
                  <div className="mb-3 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Spent
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {formatCurrency(b.spent)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Budget
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {formatCurrency(b.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
                        style={{
                          width: `${Math.min(
                            Math.max(percentage, 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.bg} ${status.text}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </div>

                    <span className="text-sm font-bold text-slate-700">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>

                  {/* Remaining */}
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p
                      className={`text-sm font-medium ${
                        b.remaining >= 0
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }`}
                    >
                      {b.remaining >= 0
                        ? `${formatCurrency(
                            b.remaining
                          )} remaining`
                        : `${formatCurrency(
                            Math.abs(b.remaining)
                          )} over budget`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <Target className="h-7 w-7 text-primary-600" />
            </div>

            <h3 className="font-semibold text-slate-900">
              No budgets yet
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Create your first monthly budget to start tracking
              your spending and financial goals.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mt-5 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Your First Budget
            </button>
          </div>
        )}
      </div>
    </div>
  );
}