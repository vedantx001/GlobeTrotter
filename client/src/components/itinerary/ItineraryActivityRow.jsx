const ItineraryActivityRow = ({ activity }) => {
  const expense = activity.custom_cost || activity.cost || activity.defaultCost;
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 py-3 border-b border-border-subtle/50 group hover:bg-surface-primary/60 transition-colors -mx-3 px-3 rounded-md font-sans">
      {/* Physical Activity */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          {activity.timeSlot && (
            <span className="font-sans text-[11px] font-medium tracking-wider uppercase text-stone">
              {activity.timeSlot}
            </span>
          )}
          <span className="font-sans text-[10px] font-medium tracking-wider uppercase text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
            {activity.category || 'Activity'}
          </span>
        </div>
        <h4 className="font-sans text-[19px] sm:text-[22px] text-primary font-semibold group-hover:text-terracotta transition-colors leading-snug">
          {activity.title}
        </h4>
        {activity.description && (
          <p className="font-sans text-xs text-secondary leading-relaxed max-w-2xl line-clamp-2">
            {activity.description}
          </p>
        )}
      </div>

      {/* Expense */}
      <div className="sm:text-right shrink-0 min-w-[80px] pt-1 font-sans">
        {expense ? (
          <span className="font-sans text-base font-medium text-primary">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(expense)}
          </span>
        ) : (
          <span className="font-sans text-stone/40 text-xs">—</span>
        )}
      </div>
    </div>
  );
};

export default ItineraryActivityRow;
