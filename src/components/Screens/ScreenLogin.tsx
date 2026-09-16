import React, { useState } from 'react';
import { UserRole } from '../../types';
import {
  Compass,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  MapPin,
  Users,
  Target,
  BarChart3,
  KeyRound,
  Sparkles,
} from 'lucide-react';

interface ScreenLoginProps {
  onLogin?: (user: { name: string; email: string; role: UserRole; title: string }) => void;
  onLoginSuccess?: (user: { name: string; email: string; role: UserRole; title: string }) => void;
}

export const ScreenLogin: React.FC<ScreenLoginProps> = ({ onLogin, onLoginSuccess }) => {
  const triggerLogin = (user: { name: string; email: string; role: UserRole; title: string }) => {
    if (onLoginSuccess) {
      onLoginSuccess(user);
    } else if (onLogin) {
      onLogin(user);
    }
  };

  const [email, setEmail] = useState('johanes@company.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('Application Admin');

  const DEMO_ACCOUNTS: { role: UserRole; name: string; email: string; title: string }[] = [
    {
      role: 'Application Admin',
      name: 'Johanes Harindrias',
      email: 'johanes@company.com',
      title: 'Regional Strategy Lead & Admin',
    },
    {
      role: 'Executive / Management',
      name: 'Budi Santoso',
      email: 'budi.santoso@company.com',
      title: 'Chief Strategy Officer',
    },
    {
      role: 'Regional Manager',
      name: 'Andi Pratama',
      email: 'andi@company.com',
      title: 'Regional Manager (Jawa Tengah)',
    },
    {
      role: 'CRM / Marketing',
      name: 'Sinta Rahma',
      email: 'sinta@company.com',
      title: 'Lead Retention & Loyalty Specialist',
    },
    {
      role: 'Data Analyst',
      name: 'Rizky Putra',
      email: 'rizky@company.com',
      title: 'Senior Spatial Data Analyst',
    },
  ];

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const match = DEMO_ACCOUNTS.find((a) => a.role === selectedDemoRole) || DEMO_ACCOUNTS[0];
      triggerLogin({
        name: match.name,
        email: email || match.email,
        role: match.role,
        title: match.title,
      });
      setIsLoading(false);
    }, 450);
  };

  const handleSSO = () => {
    setIsLoading(true);
    setTimeout(() => {
      triggerLogin({
        name: 'Johanes Harindrias',
        email: 'johanes@company.com',
        role: 'Application Admin',
        title: 'Regional Strategy Lead',
      });
      setIsLoading(false);
    }, 450);
  };

  const selectDemoAccount = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setSelectedDemoRole(acc.role);
    setEmail(acc.email);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-800/40">
        {/* LEFT PANEL — Geospatial Brand & Vision */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Abstract Map & Grid Lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
              <defs>
                <pattern id="loginGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#loginGrid)" />
              {/* Radar Rings */}
              <circle cx="200" cy="200" r="160" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="200" cy="200" r="110" stroke="#38bdf8" strokeWidth="1" />
              <circle cx="200" cy="200" r="60" stroke="#60a5fa" strokeWidth="1.5" />
              {/* Abstract Geo Nodes */}
              <circle cx="180" cy="170" r="4" fill="#38bdf8" />
              <circle cx="230" cy="210" r="5" fill="#60a5fa" />
              <circle cx="140" cy="230" r="3" fill="#f59e0b" />
              <circle cx="260" cy="160" r="4" fill="#10b981" />
              <path d="M 180 170 L 230 210 L 260 160" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 180 170 L 140 230" stroke="#f59e0b" strokeWidth="1" />
            </svg>
          </div>

          {/* Top Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Compass className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
                    SERVEON
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/90 text-blue-200 border border-blue-700/60 font-mono">
                    V2.1 FINAL
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium tracking-wide">
                  Customer-Centric Location &amp; Network Decision Intelligence
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Turn customer and location intelligence into better business decisions.
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-md">
                Platform intelijen spasial enterprise untuk memetakan urgensi retensi, pertahanan pangsa pasar, akuisisi pelanggan, dan ekspansi jaringan berbasis bukti analitis transparan.
              </p>
            </div>
          </div>

          {/* 4 Messaging Pillars: WHERE, WHO, WHAT, RESULT */}
          <div className="my-8 relative z-10 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                WHERE
              </div>
              <p className="text-slate-300 text-[11px] mt-1 font-medium leading-tight">
                Understand location opportunity.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-amber-300" />
                WHO
              </div>
              <p className="text-slate-300 text-[11px] mt-1 font-medium leading-tight">
                Understand customer behavior.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                <Target className="w-3.5 h-3.5 text-emerald-300" />
                WHAT
              </div>
              <p className="text-slate-300 text-[11px] mt-1 font-medium leading-tight">
                Recommend strategic actions.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[11px] uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5 text-purple-300" />
                RESULT
              </div>
              <p className="text-slate-300 text-[11px] mt-1 font-medium leading-tight">
                Measure business impact.
              </p>
            </div>
          </div>

          {/* Left Footer Notice */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Pilot Production Environment (Semarang Pilot)
            </span>
            <span className="font-mono text-[10px]">SERVEON Core Engine</span>
          </div>
        </div>

        {/* RIGHT PANEL — Sign In Form */}
        <div className="lg:col-span-6 bg-white p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Welcome to SERVEON
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Sign in to access Decision Intelligence.
              </p>
            </div>

            {/* Quick Demo Persona Selector */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Quick Sign-In Persona:
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Select role to simulate</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => selectDemoAccount(acc)}
                    className={`px-2 py-1 rounded-md text-[10.5px] font-semibold transition-all ${
                      selectedDemoRole === acc.role
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                  >
                    {acc.role}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Corporate Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to corporate identity provider.')}
                    className="text-xs text-blue-700 hover:underline font-medium"
                  >
                    Forgot Password
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your corporate password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-mono text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-slate-300"
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">2FA Enforced</span>
              </div>

              {/* Primary CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Secondary Option: Corporate SSO */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="grow border-t border-slate-200"></div>
                  <span className="shrink mx-3 text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                    or
                  </span>
                  <div className="grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  onClick={handleSSO}
                  disabled={isLoading}
                  className="w-full py-2 px-3.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>Sign in with Corporate SSO (Azure AD / Okta)</span>
                </button>
              </div>
            </form>

            {/* Enterprise Security Displays */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Secure Enterprise Access
              </span>
              <span className="flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                Role-Based Access Control
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                Protected Business Intelligence
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-slate-600">SERVEON V1.0</span>
            <span>Decision Intelligence Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
};
