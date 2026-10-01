'use client';

import { useEffect, useState } from 'react';
import { categoryAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Trash2,
  X,
  Tags,
  TrendingUp,
  TrendingDown,
  Palette,
  CircleDollarSign,
} from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: 'expense',
    color: '#6366f1',
  });

  const fetchData = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await categoryAPI.create(form);

      toast.success('Category created');
      setShowForm(false);

      setForm({
        name: '',
        type: 'expense',
        color: '#6366f1',
      });

      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete category?')) return;

    try {
      await categoryAPI.delete(id);
      toast.success('Deleted');
      fetchData();
    } catch {
      toast.error('Failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600" />
          <p className="text-sm text-slate-500">Loading categories...</p>
        </div>
      </div>
    );
  }

  const incomeCategories = categories.filter(
    (c) => c.type === 'income'
  );

  const expenseCategories = categories.filter(
    (c) => c.type === 'expense'
  );

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
                <Tags className="h-5 w-5 text-primary-600" />
              </div>

              <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                Financial Organization
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Categories
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Organize your income and expenses with custom categories.
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
                Add Category
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          SUMMARY
      ========================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Categories
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {categories.length}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                All financial categories
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
              <Tags className="h-5 w-5 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Income */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Income Categories
              </p>

              <h2 className="mt-2 text-2xl font-bold text-emerald-600">
                {incomeCategories.length}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Sources of income
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Expense Categories
              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-600">
                {expenseCategories.length}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Spending categories
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CREATE CATEGORY FORM
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
                  Create Category
                </h2>

                <p className="text-xs text-slate-500">
                  Add a custom category for your financial records.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {/* Name */}
            <div>
              <label className="label">Category Name</label>

              <input
                type="text"
                className="input transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                required
                placeholder="e.g. Groceries"
              />
            </div>

            {/* Type */}
            <div>
              <label className="label">Category Type</label>

              <select
                className="input transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="label">Category Color</label>

              <div className="flex h-10 items-center gap-3 rounded-lg border border-slate-200 bg-white px-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      color: e.target.value,
                    })
                  }
                  className="h-7 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                />

                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <span
                    className="h-3 w-3 rounded-full ring-2 ring-slate-100"
                    style={{
                      backgroundColor: form.color,
                    }}
                  />

                  {form.color.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="btn-primary flex-1 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Save Category
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

          {/* Preview */}
          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <Palette className="h-4 w-4 text-slate-400" />

              <span className="text-xs font-medium text-slate-500">
                Preview:
              </span>

              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: `${form.color}18`,
                  color: form.color,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: form.color,
                  }}
                />

                {form.name || 'Category Name'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          CATEGORY LISTS
      ========================================================= */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* =======================================================
            INCOME CATEGORIES
        ======================================================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Income Categories
                </h2>

                <p className="text-xs text-slate-500">
                  {incomeCategories.length} categor
                  {incomeCategories.length === 1 ? 'y' : 'ies'}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Income
            </span>
          </div>

          <div className="space-y-2">
            {incomeCategories.map((c) => (
              <div
                key={c._id}
                className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${c.color}18`,
                    }}
                  >
                    <CircleDollarSign
                      className="h-4 w-4"
                      style={{
                        color: c.color,
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {c.name}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: c.color,
                        }}
                      />

                      <span className="text-[11px] text-slate-400">
                        Income category
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(c._id)}
                  className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 opacity-70 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  title="Delete category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {incomeCategories.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-2 text-sm font-medium text-slate-500">
                  No income categories
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Create one to organize your income.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =======================================================
            EXPENSE CATEGORIES
        ======================================================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Expense Categories
                </h2>

                <p className="text-xs text-slate-500">
                  {expenseCategories.length} categor
                  {expenseCategories.length === 1 ? 'y' : 'ies'}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              Expenses
            </span>
          </div>

          <div className="space-y-2">
            {expenseCategories.map((c) => (
              <div
                key={c._id}
                className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${c.color}18`,
                    }}
                  >
                    <CircleDollarSign
                      className="h-4 w-4"
                      style={{
                        color: c.color,
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {c.name}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: c.color,
                        }}
                      />

                      <span className="text-[11px] text-slate-400">
                        Expense category
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(c._id)}
                  className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 opacity-70 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  title="Delete category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {expenseCategories.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center">
                <TrendingDown className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-2 text-sm font-medium text-slate-500">
                  No expense categories
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Create one to organize your spending.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}