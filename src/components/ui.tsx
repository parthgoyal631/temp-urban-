import React, { type ButtonHTMLAttributes, type PropsWithChildren } from 'react';
import { AlertCircle, CheckCircle2, Info, LoaderCircle, AlertTriangle, X } from 'lucide-react';
import type { Severity } from '../types/domain';

export function Card({
  children,
  className = '',
  id,
  onClick,
}: PropsWithChildren<{ className?: string; id?: string; onClick?: () => void }>) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-sm hover:bg-slate-50/50' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
  severity,
  className = '',
}: PropsWithChildren<{
  tone?: 'neutral' | 'good' | 'warn' | 'critical' | 'brand' | 'info';
  severity?: Severity;
  className?: string;
}>) {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  if (severity) {
    switch (severity) {
      case 'critical':
        style = 'bg-red-50 text-red-700 border-red-200';
        break;
      case 'high':
        style = 'bg-orange-50 text-orange-700 border-orange-200';
        break;
      case 'medium':
        style = 'bg-amber-50 text-amber-800 border-amber-200';
        break;
      case 'low':
        style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
    }
  } else {
    switch (tone) {
      case 'good':
        style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'warn':
        style = 'bg-amber-50 text-amber-800 border-amber-200';
        break;
      case 'critical':
        style = 'bg-red-50 text-red-700 border-red-200';
        break;
      case 'brand':
        style = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'info':
        style = 'bg-sky-50 text-sky-700 border-sky-200';
        break;
      case 'neutral':
      default:
        style = 'bg-slate-100 text-slate-700 border-slate-200';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium rounded-md border whitespace-nowrap tracking-wide ${style} ${className}`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'brand';
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }[size];

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs border border-blue-600',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs',
    brand: 'bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs border border-blue-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white font-medium shadow-xs border border-red-600',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 border border-transparent',
  }[variant];

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-3xl',
}: PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: string;
  maxWidth?: string;
}>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div
        className={`bg-white border border-slate-200 rounded-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col shadow-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-mono">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800">{children}</div>
      </div>
    </div>
  );
}

export function LoadingState({ label = 'Ingesting operational intelligence...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500 gap-3 font-mono text-xs">
      <LoaderCircle size={24} className="animate-spin text-blue-600" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  title = 'No records available',
  description = 'Data will populate automatically as prototype stream delivers telemetry.',
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-slate-200 rounded-2xl bg-white">
      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 mb-3">
        <Info size={18} />
      </div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({ label = 'Communication error with data stream.' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 text-red-700 rounded-xl text-sm font-medium">
      <AlertTriangle size={18} className="shrink-0 text-red-600" />
      <span>{label}</span>
    </div>
  );
}
