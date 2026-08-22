import React from 'react';
import { Database } from 'lucide-react';

const AdminEmptyState = ({ title, description }) => {
  return (
    <div className="py-12 px-6 border border-border-subtle rounded-[var(--radius-2xl)] bg-surface-secondary flex flex-col items-center justify-center text-center shadow-[var(--shadow-soft)] h-full min-h-[300px]">
      <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mb-4 text-stone">
        <Database size={24} />
      </div>
      <h3 className="font-display text-(length:--text-heading-sm) text-primary mb-2">
        {title || 'No data available'}
      </h3>
      <p className="text-secondary text-(length:--text-body-sm) max-w-xs">
        {description || 'There is not enough data to generate this report yet.'}
      </p>
    </div>
  );
};

export default AdminEmptyState;
