import React, { useState, useEffect } from 'react';
import { useAuth, ADMIN_EMAILS } from '../../contexts/AuthContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DiamondDotsSpinner, ADMIN_EASE } from '../components/AdminMotion';
import { fetchJsonSafely } from '../../utils/safeFetch';

interface AdminSignInPageProps {
  onSuccess?: () => void;
}

export default function AdminSignInPage({ onSuccess }: AdminSignInPageProps) {
  const { login, claimAdminSetup, user, logout } = useAuth();
  const [email, setEmail] = useState('bigbakket@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupSource, setSetupSource] = useState<'env' | 'claimed' | 'unclaimed'>('unclaimed');
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const isRegularUserLoggedIn = user && !ADMIN_EMAILS.includes(user.email.toLowerCase());

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetchJsonSafely<{ configured?: boolean; source?: 'env' | 'claimed' | 'unclaimed' }>(
        '/api/auth/admin-setup-status',
        { method: 'GET', credentials: 'include' }
      );
      if (!active) return;
      if (res.ok && res.data) {
        setNeedsSetup(res.data.configured === false);
        setSetupSource(res.data.source || 'unclaimed');
      } else {
        setNeedsSetup(false);
      }
      setCheckingStatus(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const resolveAdminEmail = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed.includes('@')) {
      const lower = trimmed.toLowerCase();
      if (lower === 'admin' || lower === 'administrator') return 'admin@tiqsey.com';
      if (lower === 'bigbakket') return 'bigbakket@gmail.com';
      return `${lower}@tiqsey.com`;
    }
    return trimmed;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailToUse = resolveAdminEmail(email);
    if (!emailToUse) {
      setError('Please enter your admin email address.');
      return;
    }
    if (!password) {
      setError('Please enter your administrator password.');
      return;
    }

    if (needsSetup) {
      if (!ADMIN_EMAILS.includes(emailToUse.toLowerCase())) {
        setError('Please select or enter an authorized administrator email address.');
        return;
      }
      if (password.length < 8) {
        setError('Please choose a password with at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter to confirm.');
        return;
      }

      setIsLoading(true);
      try {
        await claimAdminSetup(emailToUse, password);
        if (onSuccess) onSuccess();
      } catch (err: any) {
        setError(err?.message || 'Unable to complete first-time administrator setup.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    try {
      const loggedUser = await login(emailToUse, password);
      const normalizedEmail = loggedUser.email.toLowerCase();
      const hasAdminRights = ADMIN_EMAILS.includes(normalizedEmail) || loggedUser.role === 'admin';

      if (!hasAdminRights) {
        setError('Access Denied: This account does not have administrator privileges.');
        setIsLoading(false);
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      if (err?.needsSetup) {
        setNeedsSetup(true);
        setSetupSource('unclaimed');
      }
      setError(err?.message || 'Invalid administrator credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full relative bg-[#edf5fc] overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 font-sans select-none">
      {/* Background soft wavy aesthetic curves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <svg
          className="absolute -top-32 -left-40 w-[800px] h-[800px] opacity-40 text-[#d8ebfa]"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M200 100 C400 50, 600 200, 700 400 C800 600, 650 750, 450 700 C250 650, 100 500, 100 300 Z"
            fill="currentColor"
          />
        </svg>

        <svg
          className="absolute -bottom-40 -right-40 w-[850px] h-[850px] opacity-50 text-[#e1f0fc]"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M300 200 C550 150, 750 300, 750 550 C750 750, 500 800, 250 750 C50 700, 50 450, 150 300 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: ADMIN_EASE }}
        className="relative z-10 w-full max-w-[480px] flex flex-col items-center"
      >
        {/* Brand Logo & Title Above Card */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center">
            <span className="text-[38px] font-black tracking-tight text-[#0f243e] font-sans">
              T
              <span className="relative inline-block">
                ı
                <span className="absolute top-[4px] left-[50%] -translate-x-[50%] w-[7px] h-[7px] bg-[#e31b23] rounded-full"></span>
              </span>
              qsey
            </span>
          </div>
          <h2 className="text-[#334e68] text-base font-semibold mt-1">
            {needsSetup ? 'Tiqsey Admin First-Time Setup' : 'Tiqsey Admin Login'}
          </h2>
        </div>

        {/* Crisp White Card */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-[0_15px_45px_rgba(15,35,60,0.06)] border border-[#e2eaf2] p-5 sm:p-9 transition-all duration-300">
          {checkingStatus ? (
            <div className="py-10 flex flex-col items-center justify-center gap-3">
              <DiamondDotsSpinner size="md" tone="blue" label="Checking admin security status" />
              <p className="text-xs font-medium text-[#627d98]">Checking administrator access...</p>
            </div>
          ) : (
            <>
              {needsSetup ? (
                <div className="mb-5 p-3.5 rounded-xl bg-sky-50 border border-sky-200/80 text-xs text-[#102a43] flex items-start gap-2.5">
                  <ShieldCheck className="w-4.5 h-4.5 shrink-0 text-[#1d64db] mt-0.5" />
                  <div className="leading-relaxed">
                    <p className="font-bold">Claim your Administrator Password</p>
                    <p className="text-[#486581] mt-0.5">
                      No admin password is set on this server yet. Create your administrator password once to lock and activate the panel.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-[#627d98] text-sm font-normal mb-6">
                  Please fill in your unique admin login details below
                </p>
              )}

              {/* Regular user warning */}
              {isRegularUserLoggedIn && (
                <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    Currently logged in as standard user <span className="font-semibold">{user.email}</span>.{' '}
                    <button
                      type="button"
                      onClick={logout}
                      className="font-bold underline text-amber-900 hover:opacity-80 cursor-pointer ml-1"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <div className="font-medium leading-relaxed">{error}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-[#102a43] mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9fb3c8]">
                      <Mail className="w-[18px] h-[18px]" strokeWidth={1.8} />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your admin email address"
                      autoComplete="username"
                      disabled={isLoading}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#d9e2ec] hover:border-[#bcccdc] rounded-xl text-sm font-medium text-[#102a43] placeholder:text-[#9fb3c8] focus:outline-none focus:ring-2 focus:ring-[#1d64db]/20 focus:border-[#1d64db] transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#102a43] mb-2">
                    {needsSetup ? 'Create Administrator Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9fb3c8]">
                      <Lock className="w-[18px] h-[18px]" strokeWidth={1.8} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={needsSetup ? 'Minimum 8 characters' : 'Enter your password'}
                      autoComplete={needsSetup ? 'new-password' : 'current-password'}
                      disabled={isLoading}
                      required
                      className="w-full pl-10 pr-10 py-3 bg-white border border-[#d9e2ec] hover:border-[#bcccdc] rounded-xl text-sm font-medium text-[#102a43] placeholder:text-[#9fb3c8] focus:outline-none focus:ring-2 focus:ring-[#1d64db]/20 focus:border-[#1d64db] transition-all disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-[#9fb3c8] hover:text-[#486581] cursor-pointer transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.8} />
                      ) : (
                        <Eye className="w-[18px] h-[18px]" strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (first-run setup only) */}
                {needsSetup && (
                  <div>
                    <label className="block text-sm font-semibold text-[#102a43] mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9fb3c8]">
                        <Lock className="w-[18px] h-[18px]" strokeWidth={1.8} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your new password"
                        autoComplete="new-password"
                        disabled={isLoading}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white border border-[#d9e2ec] hover:border-[#bcccdc] rounded-xl text-sm font-medium text-[#102a43] placeholder:text-[#9fb3c8] focus:outline-none focus:ring-2 focus:ring-[#1d64db]/20 focus:border-[#1d64db] transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                )}

                {/* Forgot password link */}
                {!needsSetup && (
                  <div className="flex justify-end pt-0.5">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="min-h-[36px] text-xs font-semibold text-[#1d64db] hover:text-[#154fa8] hover:underline cursor-pointer transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full min-h-[48px] py-3.5 px-6 bg-[#1d64db] hover:bg-[#1755be] active:bg-[#12449a] text-white font-semibold rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(29,100,219,0.3)] hover:shadow-[0_6px_20px_rgba(29,100,219,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <DiamondDotsSpinner size="xs" tone="white" label={needsSetup ? 'Saving password' : 'Signing in'} />
                        {needsSetup ? 'Setting Up Admin...' : 'Signing In...'}
                      </>
                    ) : needsSetup ? (
                      'Set Password & Sign In'
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#486581] hover:text-[#0f243e] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Tiqsey Home
          </a>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => setShowForgotModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 6 }}
              transition={{ duration: 0.2, ease: ADMIN_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-sm w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-200 relative"
            >
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                aria-label="Close modal"
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-slate-900 mb-2 pr-8">
                Administrator Password Recovery
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {setupSource === 'env'
                  ? 'Your admin password is managed via the server ADMIN_PASSWORD environment secret. Update ADMIN_PASSWORD in Settings → Secrets to reset it.'
                  : 'To reset or override your claimed administrator password, set the ADMIN_PASSWORD secret in Settings → Secrets and restart the server.'}
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 mb-4">
                <p className="font-semibold text-slate-700">Authorized Admin Accounts</p>
                <p className="font-mono text-[11px] text-slate-600">bigbakket@gmail.com · admin@tiqsey.com</p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full min-h-[44px] py-2.5 px-4 bg-[#1d64db] text-white text-xs font-semibold rounded-xl hover:bg-[#1755be] transition-colors cursor-pointer"
              >
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
