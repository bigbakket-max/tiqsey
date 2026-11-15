import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function Newsletter() {
  const { t } = useSettings();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-7xl mx-auto overflow-hidden rounded-2xl sm:rounded-[2rem] bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 relative min-h-[200px] sm:min-h-[230px] flex items-center shadow-lg border border-white/5">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-y-0 right-0 w-full md:w-1/2 opacity-35 md:opacity-90 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop" 
            alt="London" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Mask that blends it fully into the solid parent background */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 sm:px-10 md:px-12 py-6 sm:py-8 w-full max-w-xl text-center sm:text-left">
          <div className="space-y-2">
            <span className="bg-brand text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full inline-block shadow-sm">
              {t('specialOffers')}
            </span>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight italic">
              {t('newsletterTitle')}
            </h2>
            
            <p className="text-white/80 text-xs sm:text-sm font-medium max-w-md mx-auto sm:mx-0 leading-relaxed pb-1">
              {t('newsletterSubtitle')}
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-4 py-2.5 rounded-full text-xs font-bold mt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You&apos;re subscribed to Tiqsey travel deals &amp; priority offers.</span>
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto sm:mx-0 mt-3" onSubmit={handleSubmit} noValidate>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={t('yourEmail')} 
                  aria-label="Email address for newsletter"
                  className="flex-1 bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 text-white placeholder:text-white/60 font-semibold focus:outline-none focus:border-white transition-all text-xs"
                />
                <button
                  type="submit"
                  className="bg-white text-slate-950 hover:bg-slate-100 font-extrabold px-5 py-2 rounded-full text-xs uppercase tracking-wider hover:scale-103 active:scale-97 transition-all shadow-md whitespace-nowrap cursor-pointer"
                >
                  {t('subscribe')}
                </button>
              </form>
            )}
            {error && (
              <p className="text-xs font-semibold text-rose-300 mt-1">{error}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
