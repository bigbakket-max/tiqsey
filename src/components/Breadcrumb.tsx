import { ChevronRight } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const { t } = useSettings();

  return (
    <nav className={`flex items-center text-sm text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const translatedLabel = t(item.label);
        return (
          <div key={index} className="flex items-center shrink-0">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-1.5 text-slate-400 dark:text-slate-500 shrink-0" />
            )}
            {item.onClick && !isLast ? (
              <button 
                onClick={item.onClick}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-[200px]"
              >
                {translatedLabel}
              </button>
            ) : (
              <span className={`${isLast ? 'text-slate-900 dark:text-white font-medium' : ''} truncate max-w-[150px] sm:max-w-none`}>
                {translatedLabel}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
