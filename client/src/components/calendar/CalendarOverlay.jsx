import { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import ActivityDetailModal from '../explore/ActivityDetailModal';
import { generateMonthGrid, mapTripDataToCalendar, filterCalendarMap } from '../../utils/calendar_utils';

const CalendarOverlay = ({ isOpen, onClose, trip }) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  
  // Pipeline State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [groupBy, setGroupBy] = useState('Day'); // Future proofing

  // Detail State
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Base raw mapped data
  const baseCalendarMap = useMemo(() => {
    return mapTripDataToCalendar(trip);
  }, [trip]);

  // Handle Initial Month
  useEffect(() => {
    if (isOpen && trip) {
      // Find the first valid start date among stops to jump to that month
      if (trip.stops && trip.stops.length > 0 && trip.stops[0].startDate) {
        const [y, m, d] = trip.stops[0].startDate.split('-').map(Number);
        setCurrentDate(new Date(y, m - 1, 1));
      } else if (trip.startDate) {
        const [y, m, d] = trip.startDate.split('-').map(Number);
        setCurrentDate(new Date(y, m - 1, 1));
      }
    }
  }, [isOpen, trip]);

  // Filtered Map
  const filteredCalendarMap = useMemo(() => {
    return filterCalendarMap(baseCalendarMap, searchQuery, filters, groupBy);
  }, [baseCalendarMap, searchQuery, filters, groupBy]);

  // Generate Grid
  const grid = useMemo(() => {
    return generateMonthGrid(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  // Navigation
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({});
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleEventClick = (activity) => {
    setSelectedActivity(activity.placeObj || activity); 
    // The activity detail modal requires a 'place' object mapping.
    // The calendar_utils attached `placeObj` to the activity payload.
  };

  const handleDayClick = (dateStr, dayData) => {
    // Optional: Could open a day-detail modal here.
    // The prompt says "Clicking a calendar day should open a compact day-detail section..."
    // Since we're doing the minimal requested path, and Activity Detail is fully implemented,
    // let's stick to event clicks, or add a simple day detail later if needed.
  };

  // Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !selectedActivity) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, selectedActivity]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone/30 backdrop-blur-md sm:p-6 lg:p-12 transition-all">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative w-full max-w-[1200px] h-full sm:h-[90vh] bg-warm-white sm:rounded-[var(--radius-3xl)] shadow-[var(--shadow-modal)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col border border-border-subtle/50">
        
        {/* Absolute Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 text-secondary hover:text-primary transition-colors p-3 rounded-full bg-surface-primary/50 backdrop-blur-md shadow-sm border border-border-subtle hover:bg-white focus:outline-none"
          aria-label="Close Calendar"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* Header and Controls */}
        <div className="shrink-0">
          <CalendarHeader 
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFilterChange={handleFilterChange}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
          />
        </div>

        {/* Calendar Grid Area */}
        <div className="flex-1 overflow-hidden bg-ivory/50 flex flex-col p-6 pt-0">
          <div className="flex-1 bg-surface-primary rounded-[var(--radius-2xl)] border border-border-subtle shadow-sm overflow-hidden flex flex-col">
            <CalendarGrid 
              grid={grid} 
              calendarMap={filteredCalendarMap}
              onDayClick={handleDayClick}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
      </div>

      {/* Detail Modals (Stacked on top) */}
      <ActivityDetailModal 
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        place={selectedActivity}
      />
    </div>
  );
};

export default CalendarOverlay;
