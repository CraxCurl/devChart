import React from 'react';
import { cn } from '@/lib/utils';

export interface GradientInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label?: string;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
}

export const GradientInput = React.forwardRef<HTMLElement, GradientInputProps>(
  ({ className, label, error, as: Component = 'input', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/60 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-transparent opacity-0 rounded-xl blur transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none" />
          <Component
            ref={ref as any}
            className={cn(
              'relative w-full bg-[#0a0a0a] text-white border border-white/10 rounded-xl py-3.5 px-5 focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20',
              error && 'border-red-500/50 focus:border-red-500/80',
              className
            )}
            {...props as any}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
GradientInput.displayName = 'GradientInput';
