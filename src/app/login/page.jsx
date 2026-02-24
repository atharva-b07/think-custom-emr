'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Brain, Activity, Shield, Zap, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    const result = await login(username, password);
    if (!result.success) {
      setError(result.message);
      setIsLoggingIn(false);
    } else {
      router.replace('/');
    }
  };

  if (user) return null;

  return (
    <div className="min-h-screen flex bg-slate-950 overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl animate-float-slow" />

      {/* Left panel - Branding & AI visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative z-10 max-w-lg">
          {/* AI Neural Network visualization */}
          <div className="mb-10 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">RCM Portal</h1>
                <p className="text-blue-400 text-sm font-medium">AI-Powered Healthcare Platform</p>
              </div>
            </div>

            {/* AI Feature cards */}
            <div className="space-y-4">
              <FeatureCard
                icon={<Activity className="w-5 h-5" />}
                title="Intelligent Revenue Cycle"
                description="AI-driven claims processing and denial management with 98% accuracy"
                color="blue"
                delay="0"
              />
              <FeatureCard
                icon={<Shield className="w-5 h-5" />}
                title="Predictive Analytics"
                description="Real-time insights and forecasting powered by machine learning models"
                color="cyan"
                delay="1"
              />
              <FeatureCard
                icon={<Zap className="w-5 h-5" />}
                title="Smart Automation"
                description="Automated workflows that reduce manual tasks by 75%"
                color="violet"
                delay="2"
              />
            </div>
          </div>

          {/* AI activity indicator */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse [animation-delay:200ms]" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse [animation-delay:400ms]" />
            </div>
            <span className="text-slate-400 text-sm">AI Systems Active — All models operational</span>
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">RCM Portal</h1>
          </div>

          {/* Login card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/20">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome back</h2>
              <p className="text-slate-400">Sign in to access your AI-powered dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-11 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-blue-600/50 disabled:to-blue-500/50 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638l-3.96-3.96a.75.75 0 111.06-1.06l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06l3.96-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-5 px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
              <p className="text-blue-400 text-xs font-medium mb-2">Demo Credentials</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Username:</span>
                <code className="text-slate-200 bg-slate-800 px-2 py-0.5 rounded">demo</code>
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5">
                <span className="text-slate-400">Password:</span>
                <code className="text-slate-200 bg-slate-800 px-2 py-0.5 rounded">demo@123</code>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-5 pt-5 border-t border-slate-800">
              <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                <Shield className="w-3.5 h-3.5" />
                <span>Secured with end-to-end encryption</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-slate-600 text-xs">
            &copy; 2026 RCM Portal. AI-Powered Healthcare Management.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay }) {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
  };

  const iconBgMap = {
    blue: 'bg-blue-500/20 text-blue-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    violet: 'bg-violet-500/20 text-violet-400',
  };

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r ${colorMap[color]} border backdrop-blur-sm animate-slide-up`}
      style={{ animationDelay: `${delay * 200}ms` }}
    >
      <div className={`w-10 h-10 rounded-lg ${iconBgMap[color]} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="text-white font-medium text-sm mb-1">{title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
