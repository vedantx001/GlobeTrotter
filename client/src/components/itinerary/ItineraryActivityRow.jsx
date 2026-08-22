const ItineraryActivityRow = ({ activity }) => {
  const expense = activity.custom_cost || activity.cost || activity.defaultCost;
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-4 border-b border-border-subtle group hover:bg-surface-muted/50 transition-colors -mx-4 px-4">
      {/* Physical Activity */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold tracking-wider uppercase text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-sm">
            {activity.category || 'Activity'}
          </span>
          {activity.timeSlot && (
            <span className="text-(length:--text-caption) text-secondary font-medium">
              {activity.timeSlot}
            </span>
          )}
        </div>
        <h4 className="font-display text-(length:--text-heading-sm) text-primary mb-1 group-hover:text-terracotta transition-colors">
          {activity.title}
        </h4>
        {activity.description && (
          <p className="text-(length:--text-body-sm) text-secondary line-clamp-2 max-w-2xl">
            {activity.description}
          </p>
        )}
      </div>

      {/* Expense */}
      <div className="sm:text-right shrink-0 min-w-[100px] pt-1">
        {expense ? (
          <div className="text-(length:--text-body) font-medium text-stone bg-surface-muted sm:bg-transparent px-3 py-1 sm:p-0 rounded-md inline-block">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(expense)}
          </div>
        ) : (
          <div className="text-secondary/50 font-medium">—</div>
        )}
      </div>
    </div>
  );
};

export default ItineraryActivityRow;
