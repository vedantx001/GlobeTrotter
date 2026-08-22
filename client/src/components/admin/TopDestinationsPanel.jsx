import React from 'react';

const TopDestinationsPanel = ({ data }) => {
  return (
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-6">
      <div className="mb-6">
        <h3 className="font-display text-(length:--text-heading-sm) text-primary">Top Destinations</h3>
        <p className="text-secondary text-(length:--text-body-sm)">Fastest growing cities.</p>
      </div>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.city} className="flex items-center justify-between p-3 rounded-[var(--radius-lg)] hover:bg-surface-secondary transition-colors border border-transparent hover:border-border-subtle">
            <div className="flex items-center gap-4">
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index < 3 ? 'bg-primary text-warm-white' : 'bg-surface-muted text-secondary'}`}>
                {item.rank}
              </span>
              <span className="font-medium text-primary">{item.city}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-secondary text-(length:--text-body-sm)">{item.tripsCount} trips</span>
              <span className="text-success text-(length:--text-caption) font-medium bg-success-soft px-2 py-0.5 rounded-full">{item.growth}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDestinationsPanel;
