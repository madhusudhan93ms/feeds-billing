import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'positive', // 'positive' | 'negative' | 'neutral'
  variant = 'blue', // 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'indigo' | 'cyan'
  onClick
}) => {
  const colorSchemes = {
    blue: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-100',
      text: 'text-blue-700',
      iconBg: 'bg-blue-500 text-white',
      badge: 'bg-blue-100 text-blue-800'
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-100',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-500 text-white',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    amber: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-100',
      text: 'text-amber-700',
      iconBg: 'bg-amber-500 text-white',
      badge: 'bg-amber-100 text-amber-800'
    },
    rose: {
      bg: 'bg-rose-50/70',
      border: 'border-rose-100',
      text: 'text-rose-700',
      iconBg: 'bg-rose-500 text-white',
      badge: 'bg-rose-100 text-rose-800'
    },
    purple: {
      bg: 'bg-purple-50/70',
      border: 'border-purple-100',
      text: 'text-purple-700',
      iconBg: 'bg-purple-500 text-white',
      badge: 'bg-purple-100 text-purple-800'
    },
    indigo: {
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-100',
      text: 'text-indigo-700',
      iconBg: 'bg-indigo-500 text-white',
      badge: 'bg-indigo-100 text-indigo-800'
    },
    cyan: {
      bg: 'bg-cyan-50/70',
      border: 'border-cyan-100',
      text: 'text-cyan-700',
      iconBg: 'bg-cyan-500 text-white',
      badge: 'bg-cyan-100 text-cyan-800'
    }
  };

  const scheme = colorSchemes[variant] || colorSchemes.blue;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border ${scheme.border} bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
          </div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${scheme.iconBg} shadow-xs`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center space-x-1.5 text-xs">
          <span
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-medium ${
              trendType === 'positive'
                ? 'bg-emerald-50 text-emerald-700'
                : trendType === 'negative'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};
