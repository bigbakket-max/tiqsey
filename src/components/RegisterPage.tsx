import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage({
  onBackToHome,
  onNavigateToSignIn
}: {
  onBackToHome: () => void;
  onNavigateToSignIn: () => void;
}) {
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await register(name, email, password);
      onBackToHome();
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      const userEmail = email.trim() || 'explorer@tiqsey.com';
      const userName = name.trim() || userEmail.split('@')[0].replace(/[._]/g, ' ');
      await loginWithGoogle(
        userEmail,
        userName.charAt(0).toUpperCase() + userName.slice(1),
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      );
      onBackToHome();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] w-full relative bg-gradient-to-b from-[#eaf2f9] via-[#edf5fc] to-[#e4eef7] flex items-center justify-center py-10 sm:py-14 px-4 sm:px-6 md:px-8 overflow-hidden font-sans selection:bg-[#e31b23]/10 selection:text-[#e31b23]">
      {/* Background Travel-Themed Illustrations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Top-Left Airplane & Dashed Flight Contrail Arc */}
        <div className="absolute -top-6 -left-6 sm:top-6 sm:left-10 w-72 sm:w-96 h-72 sm:h-96 opacity-40">
          <svg viewBox="0 0 350 350" fill="none" className="w-full h-full">
            <path
              d="M 20 280 Q 90 200, 180 150 T 260 80"
              stroke="#9ec6e8"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              strokeLinecap="round"
              fill="none"
            />
            <g transform="translate(255, 75) rotate(-35)">
              <path
                d="M12 2C11.5 2 11 2.5 11 3.5V9.5L3 14V16L11 13.5V19.5L8.5 21V22.5L12 21.5L15.5 22.5V21L13 19.5V13.5L21 16V14L13 9.5V3.5C13 2.5 12.5 2 12 2Z"
                fill="#93bedf"
                transform="scale(1.4)"
              />
            </g>
          </svg>
        </div>

        {/* Top-Right Floating Hot Air Balloon */}
        <div className="absolute top-10 right-6 sm:top-14 sm:right-16 w-20 sm:w-28 opacity-45">
          <svg viewBox="0 0 100 130" fill="none" className="w-full h-auto">
            <path
              d="M50 5 C22 5 15 32 20 56 C24 72 38 88 43 96 L57 96 C62 88 76 72 80 56 C85 32 78 5 50 5 Z"
              fill="#adcfe9"
              stroke="#98c0dc"
              strokeWidth="1.5"
            />
            <path
              d="M50 5 C40 5 35 32 37 56 C39 72 45 88 47 96 L53 96 C55 88 61 72 63 56 C65 32 60 5 50 5 Z"
              fill="#9bc2df"
              opacity="0.8"
            />
            <line x1="43" y1="96" x2="43" y2="108" stroke="#8cb5d5" strokeWidth="1.2" />
            <line x1="57" y1="96" x2="57" y2="108" stroke="#8cb5d5" strokeWidth="1.2" />
            <rect x="42" y="108" width="16" height="12" rx="2" fill="#8cb5d5" />
          </svg>
        </div>

        {/* Bottom Silhouette: World Landmarks */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-48 sm:h-72 opacity-35 sm:opacity-40">
          <svg viewBox="0 0 1440 260" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0 260 L0 180 Q 250 140, 500 170 T 1000 150 Q 1250 160, 1440 180 L1440 260 Z"
              fill="#bed9ed"
              opacity="0.5"
            />
            <path d="M40 260 L40 160 L50 130 L60 160 L60 260 Z" fill="#a7cee9" />
            <path d="M75 260 L75 140 L85 100 L95 140 L95 260 Z" fill="#9ec8e6" />
            <g transform="translate(1080, 75)" fill="#a0c9e7">
              <path d="M 0 185 L 0 50 Q 120 20, 240 50 L 240 185 Z" />
            </g>
            <g transform="translate(1330, 20)" fill="#93bedf">
              <rect x="38" y="0" width="4" height="25" />
              <polygon points="35,25 45,25 43,80 37,80" />
              <rect x="32" y="80" width="16" height="8" rx="1" />
              <polygon points="33,88 47,88 53,150 27,150" />
              <rect x="22" y="150" width="36" height="10" rx="2" />
              <path d="M 24 160 L 5 240 L 22 240 L 30 185 Q 40 170, 50 185 L 58 240 L 75 240 L 56 160 Z" />
            </g>
          </svg>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[26px] sm:rounded-[30px] shadow-[0_20px_60px_-15px_rgba(20,50,90,0.07),0_0_1px_1px_rgba(0,0,0,0.04)] border border-white/80 px-7 py-8 sm:px-10 sm:py-10 my-6 transition-all">
        {/* Logo */}
        <div className="flex items-center justify-center relative mb-5 sm:mb-6">
          <div className="flex items-center justify-center gap-1 select-none">
            <span className="text-[28px] sm:text-[31px] font-black text-[#e31b23] tracking-tight leading-none">
              Tiqsey
            </span>
            <svg
              className="w-6 h-6 inline-block fill-current text-[#e31b23] -rotate-12 translate-y-[-1px]"
              viewBox="0 0 24 24"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mb-5 sm:mb-6">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Heading & Subtitle */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-[28px] font-black text-[#0f1d35] tracking-tight flex items-center gap-2">
            <span>Create an account</span>
            <span className="inline-block select-none">✨</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-[13.5px] text-slate-500 leading-relaxed font-normal">
            Join Tiqsey to start exploring and booking your next adventure.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 bg-rose-50 border border-rose-200/80 text-rose-700 px-4 py-3 rounded-xl text-xs sm:text-[13px] font-medium flex items-start gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs sm:text-[13px] font-medium flex items-start gap-2.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-snug">{successMessage}</p>
          </div>
        )}

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50/90 active:bg-slate-100 border border-slate-200/90 rounded-xl text-xs sm:text-[13.5px] font-semibold text-slate-700 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4.5 h-4.5 animate-spin text-slate-500" />
          ) : (
            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
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

        {/* OR Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/90"></div>
          </div>
          <div className="relative bg-white px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase select-none">
            OR
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="John Doe"
                className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#5fa6d9] focus:ring-3 focus:ring-[#5fa6d9]/15 transition-all outline-none font-normal"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="name@example.com"
                className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#5fa6d9] focus:ring-3 focus:ring-[#5fa6d9]/15 transition-all outline-none font-normal"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Create a strong password (6+ chars)"
                className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-xl pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#5fa6d9] focus:ring-3 focus:ring-[#5fa6d9]/15 transition-all outline-none font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full mt-2 py-3 sm:py-3.5 px-4 bg-[#e31b23] hover:bg-[#d0141c] active:scale-[0.99] text-white font-bold text-xs sm:text-[14px] rounded-xl shadow-[0_4px_14px_rgba(227,27,35,0.3)] hover:shadow-[0_6px_20px_rgba(227,27,35,0.38)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Footer: Sign in Link */}
        <p className="mt-6 text-center text-xs sm:text-[13px] text-slate-500 font-normal">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToSignIn}
            className="text-[#e31b23] font-semibold hover:underline cursor-pointer ml-1"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
