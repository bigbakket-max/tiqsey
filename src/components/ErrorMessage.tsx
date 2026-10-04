import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ 
  title, 
  message,
  onRetry 
}: ErrorMessageProps) {
  const { t } = useSettings();

  const displayTitle = title ? t(title) : t('somethingWentWrong', 'Something went wrong');
  const displayMessage = message ? t(message) : t('somethingWentWrongDesc', "We couldn't load this information right now. Please try again later.");

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{displayTitle}</h3>
      <p className="text-sm text-gray-600 max-w-xs mb-4">{displayMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          {t('tryAgain', 'Try Again')}
        </button>
      )}
    </div>
  );
}
