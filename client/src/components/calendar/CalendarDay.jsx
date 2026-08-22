import CalendarEvent from './CalendarEvent';

const CalendarDay = ({ dayData, dateStr, isCurrentMonth, dayOfMonth, onDayClick, onEventClick, isGrouped }) => {
  const { stops = [], activities = [] } = dayData || {};

  // Find the primary stop for background styling
  // We'll just take the first active stop if multiple exist
  const primaryStop = stops[0];
  
  return (
    <div 
      onClick={() => onDayClick(dateStr, dayData)}
      className={`
        min-h-[70px] p-2 relative flex flex-col cursor-pointer transition-colors overflow-hidden
        ${isCurrentMonth ? 'bg-surface-primary hover:bg-surface-muted/50' : 'bg-surface-muted/30 text-stone'}
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-serif ${isCurrentMonth ? 'text-primary font-medium' : 'text-stone opacity-50'}`}>
          {dayOfMonth}
        </span>
      </div>

      {/* Trip Stop Range Indicators */}
      {stops.map(stop => (
        <div 
          key={stop.stopIndex} 
          className={`
            text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1.5 px-2 py-0.5 z-0 flex items-center h-5
            ${stop.isFirstDay ? 'rounded-l-full ml-1 bg-terracotta/10 text-terracotta border-l border-y border-terracotta/20' : ''}
            ${stop.isLastDay ? 'rounded-r-full mr-1 bg-terracotta/10 text-terracotta border-r border-y border-terracotta/20' : ''}
            ${!stop.isFirstDay && !stop.isLastDay ? 'bg-terracotta/5 text-terracotta/80 border-y border-terracotta/10 -mx-1' : ''}
            ${stop.isFirstDay && stop.isLastDay ? 'rounded-full mx-1 bg-terracotta/10 text-terracotta border border-terracotta/20' : ''}
          `}
        >
          <span className="truncate block">
            {stop.isFirstDay || (dayOfMonth === 1) ? stop.cityName : '\u00A0'}
          </span>
        </div>
      ))}

      {/* Scheduled Activities */}
      <div className="flex-1 overflow-y-auto mt-1 flex flex-col z-10 scrollbar-hide">
        {activities.slice(0, 3).map(act => (
          <CalendarEvent key={act.id} activity={act} onClick={onEventClick} />
        ))}
        {activities.length > 3 && (
          <div className="text-[10px] text-stone font-medium mt-1 px-1 hover:text-terracotta transition-colors">
            +{activities.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
