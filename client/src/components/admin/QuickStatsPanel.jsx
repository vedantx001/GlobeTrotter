import React from 'react';

const QuickStatsPanel = ({ data }) => {
  return (
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-6">
      <div className="mb-6">
        <h3 className="font-display text-(length:--text-heading-sm) text-primary">Quick Insights</h3>
        <p className="text-secondary text-(length:--text-body-sm)">Key platform averages.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-[var(--radius-lg)] bg-surface-secondary border border-border-subtle">
          <p className="text-secondary text-(length:--text-caption) uppercase tracking-wider mb-1">Avg Budget</p>
          <p className="font-display text-lg text-primary">{data.averageBudget}</p>
        </div>
        <div className="p-4 rounded-[var(--radius-lg)] bg-surface-secondary border border-border-subtle">
          <p className="text-secondary text-(length:--text-caption) uppercase tracking-wider mb-1">Avg Duration</p>
          <p className="font-display text-lg text-primary">{data.averageTripDuration}</p>
        </div>
        <div className="p-4 rounded-[var(--radius-lg)] bg-surface-secondary border border-border-subtle">
          <p className="text-secondary text-(length:--text-caption) uppercase tracking-wider mb-1">Top Category</p>
          <p className="font-display text-lg text-primary">{data.mostPopularCategory}</p>
        </div>
        <div className="p-4 rounded-[var(--radius-lg)] bg-surface-secondary border border-border-subtle">
          <p className="text-secondary text-(length:--text-caption) uppercase tracking-wider mb-1">Daily Spend</p>
          <p className="font-display text-lg text-primary">{data.averageDailySpend}</p>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsPanel;
