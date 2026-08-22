import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminStatCard = ({ title, value, trend, isPositive, icon: Icon }) => {
  return (
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-6 flex flex-col justify-between hover:shadow-[var(--shadow-hover)] transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-(length:--text-body-sm) font-medium text-secondary">{title}</h3>
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-primary">
            <Icon size={20} />
          </div>
        )}
      </div>
      <div>
        <p className="font-display text-(length:--text-heading-lg) text-primary leading-tight mb-2">{value}</p>
        <div className={`flex items-center text-(length:--text-caption) font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
          <span>{trend}</span>
          <span className="text-secondary font-normal ml-2">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default AdminStatCard;
