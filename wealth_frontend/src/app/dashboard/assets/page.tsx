'use client';

import { useEffect, useState } from 'react';
import { assetAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {
  Plus,
  Trash2,
  Building2,
  X,
  Wallet,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Percent,
  Landmark,
  Gem,
  Car,
  Banknote,
  Laptop,
  MoreHorizontal,
} from 'lucide-react';

const ASSET_TYPES = [
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'investment', label: 'Investment' },
  { value: 'cash', label: 'Cash' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'other', label: 'Other' },
];

const getAssetIcon = (type: string) => {
  switch (type) {
    case 'real_estate':
      return Landmark;
    case 'vehicle':
      return Car;
    case 'investment':
      return TrendingUp;
    case 'cash':
      return Banknote;
    case 'jewelry':
      return Gem;
    case 'electronics':
      return Laptop;
    default:
      return MoreHorizontal;
  }
};

const getAssetLabel = (type: string) => {
  return (
    ASSET_TYPES.find((item) => item.value === type)?.label ||
    type.replace('_', ' ')
  );
};

export default function AssetsPage() {
  const { user } = useAuth();

  const [assets, setAssets] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: 'real_estate',
    currentValue: '',
    purchasePrice: '',
    purchaseDate: '',
    description: '',
    depreciationRate: '0',
  });

  const fetchData = async () => {
    try {
      const res = await assetAPI.getAll();

      setAssets(res.data.data);
      setTotalValue(res.data.totalValue);
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
      await assetAPI.create({
        ...form,
        currentValue: Number(form.currentValue),
        purchasePrice: Number(form.purchasePrice) || 0,
        depreciationRate: Number(form.depreciationRate) || 0,
      });

      toast.success('Asset added');
      setShowForm(false);

      setForm({
        name: '',
        type: 'real_estate',
        currentValue: '',
        purchasePrice: '',
        purchaseDate: '',
        description: '',
        depreciationRate: '0',
      });

      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this asset?')) return;

    try {
      await assetAPI.delete(id);
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
          <p className="text-sm text-slate-500">Loading assets...</p>
        </div>
      </div>
    );
  }

  const totalPurchaseValue = assets.reduce(
    (sum, asset) => sum + Number(asset.purchasePrice || 0),
    0
  );

  const totalGainLoss = assets.reduce(
    (sum, asset) =>
      sum +
      (Number(asset.currentValue || 0) -
        Number(asset.purchasePrice || 0)),
    0
  );

  const assetsWithPurchasePrice = assets.filter(
    (asset) => Number(asset.purchasePrice || 0) > 0
  ).length;

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
                <Building2 className="h-5 w-5 text-primary-600" />
              </div>

              <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                Wealth Management
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Assets
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your assets, current values and overall wealth.
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
                Add Asset
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          SUMMARY CARDS
      ========================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Value */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Asset Value
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(totalValue)}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Current combined value
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
              <Wallet className="h-5 w-5 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Purchase Value */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Purchase Value
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(totalPurchaseValue)}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {assetsWithPurchasePrice} asset
                {assetsWithPurchasePrice !== 1 ? 's' : ''} with purchase data
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
              <Landmark className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Gain / Loss */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Value Change
              </p>

              <h2
                className={`mt-2 text-2xl font-bold ${
                  totalGainLoss >= 0
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {totalGainLoss >= 0 ? '+' : '-'}
                {formatCurrency(Math.abs(totalGainLoss))}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Compared with purchase value
              </p>
            </div>

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                totalGainLoss >= 0
                  ? 'bg-emerald-50'
                  : 'bg-red-50'
              }`}
            >
              {totalGainLoss >= 0 ? (
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ADD ASSET FORM
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
                  Add New Asset
                </h2>

                <p className="text-xs text-slate-500">
                  Add details about your property, investment or valuable item.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {/* Name */}
            <div>
              <label className="label">Asset Name</label>

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
                placeholder="e.g. My House"
              />
            </div>

            {/* Type */}
            <div>
              <label className="label">Asset Type</label>

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
                {ASSET_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Value */}
            <div>
              <label className="label">Current Value</label>

              <div className="relative">
                <input
                  type="number"
                  className="input pr-16 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  value={form.currentValue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      currentValue: e.target.value,
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

            {/* Purchase Price */}
            <div>
              <label className="label">Purchase Price</label>

              <div className="relative">
                <input
                  type="number"
                  className="input pr-16 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  value={form.purchasePrice}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      purchasePrice: e.target.value,
                    })
                  }
                  min="0"
                  step="0.01"
                  placeholder="Optional"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                  {user?.currency || 'PKR'}
                </span>
              </div>
            </div>

            {/* Purchase Date */}
            <div>
              <label className="label">Purchase Date</label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  className="input pl-10 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  value={form.purchaseDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      purchaseDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Depreciation */}
            <div>
              <label className="label">
                Depreciation Rate (% / year)
              </label>

              <div className="relative">
                <input
                  type="number"
                  className="input pr-10 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  value={form.depreciationRate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      depreciationRate: e.target.value,
                    })
                  }
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="0"
                />

                <Percent className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="label">Description</label>

              <input
                type="text"
                className="input transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Optional description"
              />
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="btn-primary flex-1 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Save Asset
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
          ASSET LIST
      ========================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your Assets
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage and monitor the current value of your assets.
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {assets.length} {assets.length === 1 ? 'Asset' : 'Assets'}
          </div>
        </div>

        {assets.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {assets.map((a) => {
              const AssetIcon = getAssetIcon(a.type);

              const currentValue = Number(a.currentValue || 0);
              const purchasePrice = Number(a.purchasePrice || 0);

              const difference = currentValue - purchasePrice;

              const hasPurchasePrice = purchasePrice > 0;

              return (
                <div
                  key={a._id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >
                  {/* Top Accent */}
                  <div className="absolute left-0 top-0 h-1 w-full bg-primary-500" />

                  {/* Header */}
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                        <AssetIcon className="h-5 w-5 text-primary-600" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {a.name}
                        </h3>

                        <p className="mt-1 text-xs font-medium text-slate-500">
                          {getAssetLabel(a.type)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(a._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                      title="Delete asset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Current Value */}
                  <div className="mb-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Current Value
                    </p>

                    <p className="mt-1 text-2xl font-bold text-primary-600">
                      {formatCurrency(currentValue)}
                    </p>
                  </div>

                  {/* Purchase Information */}
                  {hasPurchasePrice && (
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          Purchase Price
                        </span>

                        <span className="text-sm font-semibold text-slate-700">
                          {formatCurrency(purchasePrice)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          Value Change
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 text-sm font-semibold ${
                            difference > 0
                              ? 'text-emerald-600'
                              : difference < 0
                              ? 'text-red-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {difference > 0 ? (
                            <TrendingUp className="h-3.5 w-3.5" />
                          ) : difference < 0 ? (
                            <TrendingDown className="h-3.5 w-3.5" />
                          ) : null}

                          {difference > 0 ? '+' : ''}
                          {formatCurrency(difference)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Purchase Date */}
                  {a.purchaseDate && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />

                      Purchased on{' '}
                      {new Date(a.purchaseDate).toLocaleDateString()}
                    </div>
                  )}

                  {/* Depreciation */}
                  {a.depreciationRate > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <Percent className="h-3.5 w-3.5" />

                      Depreciation: {a.depreciationRate}% / year
                    </div>
                  )}

                  {/* Description */}
                  {a.description && (
                    <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
                      {a.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <Building2 className="h-7 w-7 text-primary-600" />
            </div>

            <h3 className="font-semibold text-slate-900">
              No assets yet
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Add your first asset to start tracking your total wealth
              and net worth.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mt-5 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Your First Asset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}