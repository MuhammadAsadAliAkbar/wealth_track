
'use client';

import { useEffect, useState } from 'react';
import { transactionAPI, categoryAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  X,
} from 'lucide-react';

export default function TransactionsPage() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    try {
      const [txRes, catRes] = await Promise.all([
        transactionAPI.getAll({ limit: 100 }),
        categoryAPI.getAll(),
      ]);

      setTransactions(txRes.data.data);
      setCategories(catRes.data.data);
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
      await transactionAPI.create({
        ...form,
        amount: Number(form.amount),
      });

      toast.success('Transaction added');
      setShowForm(false);

      setForm({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });

      fetchData();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to add'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;

    try {
      await transactionAPI.delete(id);
      toast.success('Deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filteredCats = categories.filter(
    (c) => c.type === form.type
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
          <p className="text-sm text-slate-500">
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8">
        <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-primary-100/60 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary-600">
              <Receipt className="h-4 w-4" />
              Financial Activity
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Transactions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track and manage your income and expenses.
            </p>
          </div>

          <button
            className="btn-primary flex items-center justify-center gap-2 shadow-md shadow-primary-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}

            {showForm ? 'Close' : 'Add Transaction'}
          </button>
        </div>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
            <h2 className="font-semibold text-slate-900">
              Add New Transaction
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Enter the details of your income or expense.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 p-6 md:grid-cols-3"
          >
            {/* Type */}
            <div>
              <label className="label">Type</label>

              <select
                className="input transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                    category: '',
                  })
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="label">Amount</label>

              <input
                type="number"
                className="input transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: e.target.value,
                  })
                }
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            {/* Category */}
            <div>
              <label className="label">Category</label>

              <select
                className="input transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
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

                {filteredCats.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>

              <input
                type="text"
                className="input transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="e.g. Grocery shopping"
              />
            </div>

            {/* Date */}
            <div>
              <label className="label">Date</label>

              <input
                type="date"
                className="input transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                value={form.date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    date: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="btn-primary shadow-md shadow-primary-600/15 transition-all hover:-translate-y-0.5"
              >
                Save Transaction
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

      {/* Transactions */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Table Header */}
        <div className="flex flex-col gap-1 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Transactions
            </h2>

            <p className="text-xs text-slate-500">
              {transactions.length} transaction
              {transactions.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 pr-4">
                  Date
                </th>

                <th className="px-4 py-4">
                  Description
                </th>

                <th className="px-4 py-4">
                  Category
                </th>

                <th className="px-4 py-4">
                  Type
                </th>

                <th className="px-4 py-4 text-right">
                  Amount
                </th>

                <th className="px-6 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="group border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70"
                >
                  {/* Date */}
                  <td className="px-6 py-4 pr-4 text-sm text-slate-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>

                  {/* Description */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          tx.type === 'income'
                            ? 'bg-emerald-50'
                            : 'bg-red-50'
                        }`}
                      >
                        {tx.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>

                      <span className="max-w-[220px] truncate text-sm font-medium text-slate-700">
                        {tx.description || 'No description'}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor:
                          (tx.category?.color || '#6366f1') + '18',
                        color:
                          tx.category?.color || '#6366f1',
                      }}
                    >
                      {tx.category?.name || 'Uncategorized'}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        tx.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          tx.type === 'income'
                            ? 'bg-emerald-500'
                            : 'bg-red-500'
                        }`}
                      />

                      {tx.type === 'income'
                        ? 'Income'
                        : 'Expense'}
                    </span>
                  </td>

                  {/* Amount */}
                  <td
                    className={`px-4 py-4 text-right text-sm font-bold ${
                      tx.type === 'income'
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                  </td>

                  {/* Delete */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(tx._id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-70 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                      title="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center px-6 py-16">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        <Receipt className="h-6 w-6 text-slate-400" />
                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        No transactions yet
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Add your first transaction to start tracking.
                      </p>

                      <button
                        onClick={() => setShowForm(true)}
                        className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        Add your first transaction
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

