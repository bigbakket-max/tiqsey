import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

export default function SignInPage({
  onBackToHome,
  onNavigateToRegister
}: {
  onBackToHome: () => void;
  onNavigateToRegister: () => void;
}) {
  const { login } = useAuth();
  const { t } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('fillAllFields', 'Please enter your email and password.'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      onBackToHome();
    } catch (err: any) {
      setError(err.message || t('invalidCredentials', 'Invalid email or password. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError(t('enterEmailFirst', 'Please enter your email address first, then click Forgot password.'));
      return;
    }
    setForgotSent(true);
    setError('');
    setTimeout(() => setForgotSent(false), 5000);
  };

  return (
    <div className="min-h-screen w-full relative bg-[#f4f7fa] flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 font-sans select-none selection:bg-[#e31b23]/10 selection:text-[#e31b23]">
      
      {/* Centered Authentication Card */}
      <div className="relative z-10 w-full max-w-[490px] bg-white rounded-[28px] sm:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 p-8 sm:p-12 transition-all">
        
        {/* Top Centered Tiqsey Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1.5 select-none">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#e31b23] tracking-tight leading-none">
              Tiqsey
            </span>
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 fill-[#e31b23] -rotate-12 translate-y-[-1px]"
              viewBox="0 0 24 24"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group font-normal"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>{t('backToHome', 'Back to Home')}</span>
          </button>
        </div>

        {/* Headings */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-[34px] font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('welcomeBack', 'Welcome back')}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
            {t('signInHeroDesc', 'Sign in to manage your bookings, wishlist, and ticket vouchers.')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200/80 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        {/* Forgot Password Confirmation */}
        {forgotSent && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              {t('passwordResetSent', `Password reset link has been sent to ${email}.`, { email })}
            </p>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {t('emailAddress', 'Email address')}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t('emailPlaceholder', 'name@example.com')}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 transition-colors outline-none font-normal"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {t('password', 'Password')}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t('enterPassword', 'Enter your password')}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-11 pr-11 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 transition-colors outline-none font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                title={showPassword ? t('hidePassword', 'Hide password') : t('showPassword', 'Show password')}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900 transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#e31b23] focus:ring-[#e31b23] cursor-pointer"
              />
              <span className="font-normal text-slate-600">{t('rememberMe', 'Remember me')}</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#e31b23] font-normal hover:underline cursor-pointer transition-colors"
            >
              {t('forgotPassword', 'Forgot password?')}
            </button>
          </div>

          {/* Sign In Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 sm:py-4 px-6 bg-[#e31b23] hover:bg-[#d0141c] active:bg-[#b81017] text-white font-semibold text-base rounded-xl transition-all shadow-[0_4px_14px_rgba(227,27,35,0.3)] hover:shadow-[0_6px_20px_rgba(227,27,35,0.38)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>{t('signingIn', 'Signing In...')}</span>
                </>
              ) : (
                <>
                  <span>{t('signIn', 'Sign In')}</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer: Create Account Link */}
        <p className="mt-8 text-center text-sm text-slate-500 font-normal">
          {t('dontHaveAccount', "Don’t have an account yet?")}{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-[#e31b23] font-medium hover:underline cursor-pointer ml-1"
          >
            {t('createAccount', 'Create an account')}
          </button>
        </p>

      </div>
    </div>
  );
}
