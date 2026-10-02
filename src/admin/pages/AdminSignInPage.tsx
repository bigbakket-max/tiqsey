import React, { useState } from 'react';
import { useAuth, ADMIN_EMAILS } from '../../contexts/AuthContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ArrowLeft,
  X
} from 'lucide-react';

interface AdminSignInPageProps {
  onSuccess?: () => void;
}

export default function AdminSignInPage({ onSuccess }: AdminSignInPageProps) {
  const { login, user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // If a regular non-admin user is currently signed in
  const isRegularUserLoggedIn = user && !ADMIN_EMAILS.includes(user.email.toLowerCase());

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your admin email address.');
      return;
    }
    if (!password) {
      setError('Please enter your administrator password.');
      return;
    }

    // Resolve username to email if entered as simple username
    let emailToUse = trimmedEmail;
    if (!trimmedEmail.includes('@')) {
      const lower = trimmedEmail.toLowerCase();
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

  const quickFill = (adminEmail: string) => {
    setEmail(adminEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full relative bg-[#edf5fc] overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 font-sans select-none">
      
      {/* Background soft wavy aesthetic curves matching the design */}
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

      <div className="relative z-10 w-full max-w-[480px] flex flex-col items-center">
        
        {/* Brand Logo & Title Above Card */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center">
            <span className="text-[38px] font-black tracking-tight text-[#0f243e] font-sans">
              T<span className="relative inline-block">ı<span className="absolute top-[4px] left-[50%] -translate-x-[50%] w-[7px] h-[7px] bg-[#e31b23] rounded-full"></span></span>qsey
            </span>
          </div>
          <h2 className="text-[#334e68] text-base font-semibold mt-1">
            Tiqsey Admin Login
          </h2>
        </div>

        {/* Crisp White Card */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-[0_15px_45px_rgba(15,35,60,0.06)] border border-[#e2eaf2] p-7 sm:p-9 transition-all duration-300">
          
          <p className="text-center text-[#627d98] text-sm font-normal mb-6">
            Please fill in your unique admin login details below
          </p>

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
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="font-medium leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            
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
                  placeholder="Enter your email address"
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
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9fb3c8]">
                  <Lock className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#d9e2ec] hover:border-[#bcccdc] rounded-xl text-sm font-medium text-[#102a43] placeholder:text-[#9fb3c8] focus:outline-none focus:ring-2 focus:ring-[#1d64db]/20 focus:border-[#1d64db] transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9fb3c8] hover:text-[#486581] cursor-pointer transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.8} />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-[#1d64db] hover:text-[#154fa8] hover:underline cursor-pointer transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-[#1d64db] hover:bg-[#1755be] active:bg-[#12449a] text-white font-semibold rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(29,100,219,0.3)] hover:shadow-[0_6px_20px_rgba(29,100,219,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Quick Demo Pre-fill helper */}
            <div className="pt-2 text-center">
              <span className="text-[11px] font-medium text-[#829ab1] mr-1.5">
                Quick fill admin:
              </span>
              <button
                type="button"
                onClick={() => quickFill('bigbakket@gmail.com')}
                className="text-[11px] font-medium text-[#334e68] hover:text-[#1d64db] bg-[#f0f4f8] hover:bg-[#e2e8f0] px-2 py-0.5 rounded-md transition-colors cursor-pointer mr-1.5"
              >
                bigbakket@gmail.com
              </button>
              <button
                type="button"
                onClick={() => quickFill('admin@tiqsey.com')}
                className="text-[11px] font-medium text-[#334e68] hover:text-[#1d64db] bg-[#f0f4f8] hover:bg-[#e2e8f0] px-2 py-0.5 rounded-md transition-colors cursor-pointer"
              >
                admin@tiqsey.com
              </button>
            </div>

          </form>

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

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Administrator Password Recovery
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              To reset your administrator credentials or regain access, please use the master credentials:
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1 mb-4">
              <div>Email: <span className="font-bold text-[#1d64db]">bigbakket@gmail.com</span></div>
              <div>Password: <span className="font-bold text-[#1d64db]">password123</span></div>
            </div>
            <button
              onClick={() => {
                quickFill('bigbakket@gmail.com');
                setShowForgotModal(false);
              }}
              className="w-full py-2.5 px-4 bg-[#1d64db] text-white text-xs font-semibold rounded-xl hover:bg-[#1755be] transition-colors cursor-pointer"
            >
              Auto-fill & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
