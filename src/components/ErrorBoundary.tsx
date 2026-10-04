import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function DefaultErrorFallback({ error, onRefresh }: { error: Error | null; onRefresh: () => void }) {
  const { t } = useSettings();

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('somethingWentWrong', 'Something went wrong')}</h2>
      <p className="text-gray-600 max-w-md mb-6">
        {t('somethingWentWrongDesc', "We're sorry for the inconvenience. The application encountered an unexpected error.")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-all shadow-md active:scale-95 cursor-pointer text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          {t('refreshPage', 'Refresh Page')}
        </button>
        <button
          onClick={() => {
            window.location.href = '/';
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95 cursor-pointer text-sm"
        >
          {t('returnToHome', 'Return to Home')}
        </button>
      </div>
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left overflow-auto max-w-full">
        <p className="text-xs font-mono text-red-500">{error?.toString()}</p>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} onRefresh={this.handleRefresh} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
