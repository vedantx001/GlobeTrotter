import { ChevronLeft, ChevronRight, Search, Filter, Layers } from 'lucide-react';
import Button from '../common/Button';
import { useState } from 'react';

const CalendarHeader = ({ 
  currentDate, 
  onPrevMonth, 
  onNextMonth,
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  groupBy,
  onGroupByChange
}) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Simple state for dropdowns
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = Object.keys(filters).filter(k => filters[k] && filters[k] !== 'All').length;

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 p-8 pb-6 bg-warm-white relative">
      
      {/* Month Navigation & Title */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={onPrevMonth}
            className="p-2 rounded-full text-stone hover:text-primary hover:bg-surface-muted transition-all duration-300 focus:outline-none"
            aria-label="Previous Month"
          >
            <ChevronLeft size={24} strokeWidth={1} />
          </button>
          <button 
            onClick={onNextMonth}
            className="p-2 rounded-full text-stone hover:text-primary hover:bg-surface-muted transition-all duration-300 focus:outline-none"
            aria-label="Next Month"
          >
            <ChevronRight size={24} strokeWidth={1} />
          </button>
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-primary tracking-tight leading-none">
          {monthName} <span className="font-serif italic text-terracotta/80">{year}</span>
        </h2>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1 md:flex-initial md:w-64 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone group-focus-within:text-terracotta transition-colors" size={16} strokeWidth={1.5} />
          <input 
            type="text" 
            placeholder="Search timeline..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-full border border-border-default bg-surface-primary focus:outline-none focus:border-terracotta transition-all shadow-sm group-focus-within:shadow-md"
          />
        </div>

        {/* Filters */}
        <div className="relative pr-12 md:pr-0">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
              activeFilterCount > 0 
                ? 'bg-terracotta text-white border border-terracotta' 
                : 'bg-surface-primary text-primary border border-border-default hover:border-border-strong hover:shadow-md'
            }`}
          >
            <Filter size={16} strokeWidth={1.5} />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-white text-terracotta text-[10px] flex items-center justify-center font-bold">{activeFilterCount}</span>}
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full mt-3 w-72 bg-surface-primary border border-border-subtle rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] z-50 p-5 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-xs font-bold text-stone uppercase tracking-widest mb-4">Timeline Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Time of Day</label>
                  <select 
                    value={filters.timeSlot || 'All'}
                    onChange={(e) => onFilterChange('timeSlot', e.target.value)}
                    className="w-full text-sm border border-border-subtle rounded-xl bg-surface-muted px-3 py-2.5 focus:outline-none focus:border-terracotta transition-colors"
                  >
                    <option value="All">All Times</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border-subtle flex justify-end">
                <Button variant="secondary" onClick={() => { onFilterChange('clear'); setShowFilters(false); }} className="py-2 px-4 text-xs">
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CalendarHeader;
