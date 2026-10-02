import React, { useState } from 'react';
import { useAuth, ADMIN_EMAILS } from '../../contexts/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  KeyRound
} from 'lucide-react';

interface AdminSignInPageProps {
  onSuccess?: () => void;
}

export default function AdminSignInPage({ onSuccess }: AdminSignInPageProps) {
  const { login, user, logout } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If a regular user is already logged in, show who is logged in and give option to switch
  const isRegularUserLoggedIn = user && !ADMIN_EMAILS.includes(user.email.toLowerCase());

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedInput = identifier.trim();
    if (!trimmedInput) {
      setError('Please enter your admin email or username.');
      return;
    }
    if (!password) {
      setError('Please enter your administrator password.');
      return;
    }

    // Resolve username to email if entered as username
    let emailToUse = trimmedInput;
    if (!trimmedInput.includes('@')) {
      const lower = trimmedInput.toLowerCase();
      if (lower === 'admin' || lower === 'administrator') {
        emailToUse = 'admin@tiqsey.com';
      } else if (lower === 'bigbakket') {
        emailToUse = 'bigbakket@gmail.com';
      } else {
        emailToUse = `${lower}@tiqsey.com`;
      }
    }

    setIsLoading(true);

    try {
      const loggedUser = await login(emailToUse, password);
      
      const normalizedEmail = loggedUser.email.toLowerCase();
      const hasAdminRights = ADMIN_EMAILS.includes(normalizedEmail) || loggedUser.role === 'admin';

      if (!hasAdminRights) {
        setError('Access Denied: This account is authenticated, but does not have administrator privileges.');
        setIsLoading(false);
        return;
      }

      // Successful admin login
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'Invalid administrator credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickAccount = (email: string) => {
    setIdentifier(email);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7F9] dark:bg-slate-950 p-4 sm:p-6 text-slate-800 dark:text-slate-100 font-sans selection:bg-[#5fa6d9]/20 selection:text-[#0a3560]">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-6 transition-all duration-300">
        
        {/* Header Badge & Icon */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#5fa6d9]/10 dark:bg-[#5fa6d9]/20 text-[#0070bc] dark:text-[#5fa6d9] rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-2">
              <KeyRound className="w-3.5 h-3.5 text-[#0070bc]" />
              Tiqsey Admin Portal
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Administrator Sign In
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              Authenticate with your credentials to access the management dashboard.
            </p>
          </div>
        </div>

        {/* Existing regular user alert */}
        {isRegularUserLoggedIn && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              Currently signed in as standard user <span className="font-bold underline">{user.email}</span>. Sign in with an authorized admin account below or{' '}
              <button 
                type="button" 
                onClick={logout} 
                className="font-bold underline text-amber-900 dark:text-amber-200 hover:opacity-80 cursor-pointer"
              >
                Log Out
              </button>.
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div className="flex-1 leading-relaxed font-medium">{error}</div>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Admin Email / Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Admin Email / Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="bigbakket@gmail.com or admin"
                autoComplete="username"
                disabled={isLoading}
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0070bc]/30 focus:border-[#0070bc] transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                required
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0070bc]/30 focus:border-[#0070bc] transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Select Admin Accounts */}
          <div className="pt-1">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
              Quick select authorized administrator:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => fillQuickAccount('bigbakket@gmail.com')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
              >
                bigbakket@gmail.com
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount('admin@tiqsey.com')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
              >
                admin@tiqsey.com
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-xl transition-all text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating Administrator...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </div>
        </form>

        {/* Back to Home Link */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <a
            href="/"
            className="inline-flex w-full justify-center items-center gap-2 py-2.5 px-4 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Tiqsey Home
          </a>
        </div>

      </div>
    </div>
  );
}
