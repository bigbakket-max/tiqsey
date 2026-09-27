import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  KeyRound, 
  X,
  Send
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SignInPageProps {
  onBackToHome: () => void;
  onNavigateToRegister: () => void;
}

export default function SignInPage({
  onBackToHome,
  onNavigateToRegister
}: SignInPageProps) {
  const { user, login, loginWithGoogle, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // Load remembered email on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('tiqsey_remembered_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (_) {}
  }, []);

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessNotice('');

    try {
      await login(cleanEmail, password);

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('tiqsey_remembered_email', cleanEmail);
      } else {
        localStorage.removeItem('tiqsey_remembered_email');
      }

      onBackToHome();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      // Use lead admin bigbakket@gmail.com by default, or demo traveler if user prefers
      const targetEmail = email && validateEmail(email) ? email.trim() : 'bigbakket@gmail.com';
      await loginWithGoogle(
        targetEmail,
        targetEmail === 'bigbakket@gmail.com' ? 'Lead Admin' : 'Explorer Voyager',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
      );
      onBackToHome();
    } catch (err: any) {
      setError(err.message || 'Google Sign In failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = forgotEmail.trim();
    if (!clean || !validateEmail(clean)) {
      setForgotError('Please provide a valid email address.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');

    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSuccess(false);
        setForgotEmail('');
        setSuccessNotice(`Password reset instructions sent to ${clean}`);
      }, 2500);
    }, 800);
  };

  // If already authenticated
  if (user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 text-center animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              You are Already Signed In
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Welcome back, <strong className="text-slate-900 dark:text-white">{user.name}</strong>!
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <span>{user.email}</span>
              {user.role === 'admin' && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-black">
                  Admin
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={onBackToHome}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-dark transition-all cursor-pointer shadow-md active:scale-[0.99]"
            >
              Continue to Home
            </button>
            <button
              onClick={() => {
                logout();
                setError('');
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-9 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800">
        
        {/* Header */}
        <div>
          <button
            onClick={onBackToHome}
            className="flex items-center text-xs font-bold text-slate-500 hover:text-brand transition-colors mb-5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </button>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Sign in to manage your bookings, wishlist, and ticket vouchers.
          </p>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2.5 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>{successNotice}</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 p-3.5 rounded-2xl text-xs font-bold flex items-start justify-between gap-2.5 border border-rose-200 dark:border-rose-800 animate-in fade-in duration-150">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
            <button 
              onClick={() => setError('')}
              className="text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Google One-Click Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-bold text-sm shadow-xs transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            or sign in with email
          </span>
        </div>

        {/* Credentials Form */}
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm font-medium transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="block w-full pl-10 pr-11 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm font-medium transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-brand focus:ring-brand border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer"
              />
              <span className="font-semibold text-slate-600 dark:text-slate-300">Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setShowForgotModal(true);
              }}
              className="font-bold text-brand hover:text-brand-dark transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full mt-2 flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-2xl shadow-md text-sm font-bold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Register Prompt */}
        <div className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1">
          Don't have an account yet?{' '}
          <button
            onClick={onNavigateToRegister}
            className="font-bold text-brand hover:text-brand-dark transition-colors cursor-pointer ml-1"
          >
            Create an account
          </button>
        </div>

        {/* One-Click Fast Demo Accounts */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">
            Fast One-Click Demo Accounts
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('demo@tiqsey.com');
                setPassword('password123');
                setError('');
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand">
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Traveler</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">demo@tiqsey.com</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('bigbakket@gmail.com');
                setPassword('password123');
                setError('');
              }}
              className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 hover:bg-rose-100/50 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-200 group-hover:text-rose-600">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                <span>Admin</span>
              </div>
              <p className="text-[10px] text-rose-500/80 truncate mt-0.5">bigbakket@gmail.com</p>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Reset Password</h3>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotError('');
                  setForgotSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your registered email address to receive password reset instructions.
            </p>

            {forgotError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess ? (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reset email sent! Please check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand"
                />

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-brand hover:bg-brand-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {forgotLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
