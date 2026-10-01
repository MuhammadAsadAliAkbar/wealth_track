
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Wallet, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-indigo-100 px-4 py-8">

      {/* Login Card */}
      <div className="card w-full max-w-md border border-slate-200/70 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 shadow-lg shadow-primary-600/20">
            <Wallet className="h-6 w-6 text-white" />
          </div>

          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              Wealth<span className="text-primary-600">Track</span>
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Personal Finance
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="label">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="email"
                className="input pl-10 transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label className="label">
                Password
              </label>

              <button
                type="button"
                className="mb-2 text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
                onClick={() =>
                  toast('Password reset feature coming soon')
                }
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type={showPassword ? 'text' : 'password'}
                className="input pl-10 pr-11 transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn-primary w-full shadow-md shadow-primary-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/25"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">
            Secure Login
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Register */}
        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-primary-600 transition hover:text-primary-700 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

