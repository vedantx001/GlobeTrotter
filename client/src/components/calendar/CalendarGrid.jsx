import CalendarDay from './CalendarDay';

const CalendarGrid = ({ grid, calendarMap, onDayClick, onEventClick }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full bg-ivory/50">
      {/* Header Row */}
      <div className="grid grid-cols-7 bg-surface-primary pb-2 border-b border-border-subtle pt-4 px-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Grid Rows */}
      <div className="flex-1 grid grid-cols-1 grid-rows-none auto-rows-fr bg-border-subtle/50 gap-[1px] overflow-y-auto">
        {grid.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-[1px] h-full">
            {week.map((day, dayIdx) => (
              <CalendarDay
                key={`${weekIdx}-${dayIdx}`}
                dateStr={day.dateString}
                dayOfMonth={day.dayOfMonth}
                isCurrentMonth={day.isCurrentMonth}
                dayData={calendarMap[day.dateString]}
                onDayClick={onDayClick}
                onEventClick={onEventClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
