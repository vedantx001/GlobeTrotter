const CalendarEvent = ({ activity, onClick }) => {
  // A color mapping for categories to give subtle visual distinction (if desired)
  // or we just stick to Ivory Luxe colors (terracotta for primary, secondary for others)
  
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'adventure': return 'bg-terracotta/10 text-terracotta border-terracotta/20';
      case 'food & dining': return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'culture': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'relaxation': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'nature': return 'bg-green-600/10 text-green-700 border-green-600/20';
      default: return 'bg-surface-muted text-primary border-border-default';
    }
  };

  // If we only stick strictly to Ivory Luxe, we can just use bg-surface-muted or bg-terracotta/10.
  // We'll use a unified style to stay strict to the design system rules.
  
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(activity);
      }}
      className="w-full text-left flex items-start gap-1.5 px-1 py-1 group focus:outline-none rounded-md hover:bg-surface-muted transition-colors mt-0.5"
    >
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
        activity.category?.toLowerCase() === 'adventure' ? 'bg-terracotta' :
        activity.category?.toLowerCase() === 'food & dining' ? 'bg-orange-500' :
        activity.category?.toLowerCase() === 'culture' ? 'bg-blue-500' :
        activity.category?.toLowerCase() === 'relaxation' ? 'bg-emerald-500' :
        'bg-stone'
      }`} />
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[11px] font-medium text-primary group-hover:text-terracotta truncate w-full leading-tight">
          {activity.title}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          {activity.timeSlot && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-secondary truncate">
              {activity.timeSlot}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default CalendarEvent;
