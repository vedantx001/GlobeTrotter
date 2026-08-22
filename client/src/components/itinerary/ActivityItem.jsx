import { Trash2, Clock } from 'lucide-react';

const ActivityItem = ({ activity, onRemove }) => {
  const expense = activity.custom_cost || activity.cost || activity.defaultCost || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="group flex items-start justify-between py-3 px-3.5 rounded-lg hover:bg-surface-secondary/60 transition-colors font-sans border-b border-border-subtle/40 last:border-0">
      <div className="flex-1 space-y-1 pr-3">
        <h4 className="font-sans text-sm sm:text-base font-semibold text-primary group-hover:text-terracotta transition-colors leading-snug">
          {activity.title}
        </h4>
        <div className="flex items-center gap-2.5 flex-wrap text-xs text-secondary font-sans">
          {activity.category && (
            <span className="font-sans text-[10px] font-medium tracking-wider uppercase text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
              {activity.category}
            </span>
          )}
          <span className="inline-flex items-center gap-1 font-sans text-xs text-secondary">
            <Clock size={12} className="text-stone/70" />
            {activity.time_slot || 'Anytime'}
          </span>
          {activity.description && (
            <span className="font-sans text-xs text-stone/80 line-clamp-1">
              · {activity.description}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0 pt-0.5 font-sans">
        <span className="font-sans text-sm font-semibold text-primary">
          {expense > 0 ? formatCurrency(expense) : '—'}
        </span>

        <button
          type="button"
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-stone/60 hover:text-danger hover:bg-danger-soft rounded-full transition-all cursor-pointer"
          title="Remove activity"
          aria-label="Remove activity"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default ActivityItem;
