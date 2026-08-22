import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const DateRangePicker = ({ startDate, endDate, onChange, error, minDate, maxDate }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    // Start with the month of the selected startDate, or minDate, or current month
    const initDate = startDate ? new Date(startDate) : (minDate ? new Date(minDate) : new Date());
    return new Date(initDate.getFullYear(), initDate.getMonth(), 1);
  });
  
  const [hoverDate, setHoverDate] = useState(null);

  // Helper: Normalize date to start of day for comparison
  const normalize = (date) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  // Helper: Format local date to YYYY-MM-DD safely
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const today = normalize(new Date());
  const min = normalize(minDate) || today;
  const max = normalize(maxDate);
  
  const start = normalize(startDate);
  const end = normalize(endDate);
  const hover = normalize(hoverDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const { days, year, monthName } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const monthStr = currentDate.toLocaleString('default', { month: 'long' });
    
    // First day of the month
    const firstDay = new Date(y, m, 1).getDay();
    // Number of days in the month
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    
    const dayArray = [];
    
    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
      dayArray.push(null);
    }
    
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      dayArray.push(new Date(y, m, i));
    }
    
    return { days: dayArray, year: y, monthName: monthStr };
  }, [currentDate]);

  const handleDayClick = (day) => {
    if (!day) return;
    const dayTime = normalize(day);
    
    if (dayTime < min || (max && dayTime > max)) return; // Don't allow outside bounds

    const dateStr = formatDate(day);

    if (!start) {
      // Set start date
      onChange(dateStr, '');
    } else if (start && !end) {
      // If clicking before start date, reset start date
      if (dayTime < start) {
        onChange(dateStr, '');
      } else {
        // Set end date
        onChange(startDate, dateStr);
      }
    } else {
      // Both are set, reset and start new selection
      onChange(dateStr, '');
    }
  };

  const handleMouseEnter = (day) => {
    if (day && start && !end) {
      setHoverDate(day);
    }
  };

  const handleMouseLeave = () => {
    setHoverDate(null);
  };

  return (
    <div className={`w-full bg-surface-elevated rounded-[var(--radius-xl)] border p-5 transition-colors ${
      error ? 'border-danger' : 'border-border-subtle shadow-[var(--shadow-soft)]'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-(length:--text-heading-sm) text-primary">
          {monthName} <span className="text-secondary ml-1">{year}</span>
        </h3>
        <div className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={prevMonth}
            className="p-1.5 rounded-full hover:bg-surface-muted text-secondary transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            type="button" 
            onClick={nextMonth}
            className="p-1.5 rounded-full hover:bg-surface-muted text-secondary transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="text-center text-(length:--text-caption) font-medium text-secondary/60">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1" onMouseLeave={handleMouseLeave}>
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="h-10 w-full" />;
          
          const dayTime = normalize(day);
          const isBeforeMin = dayTime < min;
          const isAfterMax = max ? dayTime > max : false;
          const isDisabled = isBeforeMin || isAfterMax;
          
          const isStart = dayTime === start;
          const isEnd = dayTime === end;
          const isSelected = isStart || isEnd;
          
          let isInRange = false;
          if (start && end) {
            isInRange = dayTime > start && dayTime < end;
          } else if (start && hover) {
            isInRange = dayTime > start && dayTime <= hover;
          }

          let baseClasses = "relative h-10 w-full flex items-center justify-center text-(length:--text-body-sm) font-medium transition-all duration-200 z-10";
          let wrapperClasses = "relative w-full h-full flex items-center justify-center";
          
          if (isDisabled) {
            baseClasses += " text-secondary/30 cursor-not-allowed";
          } else {
            baseClasses += " cursor-pointer";
            if (!isSelected && !isInRange) {
              baseClasses += " hover:bg-surface-muted hover:text-primary rounded-full";
            }
          }

          if (isSelected) {
            baseClasses += " bg-obsidian text-warm-white rounded-full shadow-md z-20";
          } else if (isInRange) {
            baseClasses += " text-primary";
            wrapperClasses += " bg-warm-ash/30"; // Range background
          }

          // Connecting backgrounds for range
          if (isStart && (end || hover)) {
            wrapperClasses += " before:absolute before:right-0 before:top-0 before:bottom-0 before:w-1/2 before:bg-warm-ash/30 before:z-0";
          }
          if (isEnd) {
            wrapperClasses += " before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1/2 before:bg-warm-ash/30 before:z-0";
          }

          return (
            <div 
              key={dayTime} 
              className={wrapperClasses}
              onClick={() => !isDisabled && handleDayClick(day)}
              onMouseEnter={() => !isDisabled && handleMouseEnter(day)}
            >
              <div className={baseClasses}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer / Help text */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          {!start ? (
            <span className="text-(length:--text-caption) text-secondary">Select start date</span>
          ) : !end ? (
            <span className="text-(length:--text-caption) text-secondary">Select end date</span>
          ) : (
            <span className="text-(length:--text-caption) text-primary font-medium">Range selected</span>
          )}
        </div>
        
        {start && (
          <button
            type="button"
            onClick={() => onChange('', '')}
            className="text-(length:--text-caption) text-secondary hover:text-danger transition-colors font-medium px-2 py-1 rounded-md hover:bg-danger-soft/50"
          >
            Clear dates
          </button>
        )}
      </div>

    </div>
  );
};

export default DateRangePicker;
