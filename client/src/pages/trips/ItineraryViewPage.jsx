import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getTripItinerary } from '../../api/trips_api';
import Button from '../../components/common/Button';
import { ArrowLeft, Edit2, Calendar, Share2, Plus } from 'lucide-react';
import ItineraryToolbar from '../../components/itinerary/ItineraryToolbar';
import BudgetSummary from '../../components/itinerary/BudgetSummary';
import CalendarOverlay from '../../components/calendar/CalendarOverlay';
import ItineraryDayAccordion from '../../components/itinerary/ItineraryDayAccordion';

const ItineraryViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [groupBy, setGroupBy] = useState('Day');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Date');

  // Accordion open/close state map
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const data = await getTripItinerary(id);
        setItinerary(data);
      } catch (err) {
        setError('Unable to load the itinerary.');
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [id]);

  // 1. Flatten all activities and attach context
  const flatActivities = useMemo(() => {
    if (!itinerary?.stops) return [];
    
    let dayIndex = 1;
    const activities = [];
    
    const sortedStops = [...itinerary.stops].sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0));

    sortedStops.forEach(stop => {
      if (!stop.startDate) return;
      
      const start = new Date(stop.startDate);
      const end = new Date(stop.endDate || stop.startDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

      const current = new Date(start);
      current.setHours(0,0,0,0);
      const endClean = new Date(end);
      endClean.setHours(0,0,0,0);

      while (current <= endClean) {
        const dateStr = current.toISOString().split('T')[0];
        const isFirstDay = current.getTime() === start.getTime();

        const dayActs = stop.activities?.filter(act => {
          if (act.scheduled_date) return act.scheduled_date.startsWith(dateStr);
          return isFirstDay;
        }) || [];

        dayActs.forEach(act => {
          activities.push({
            ...act,
            _dateObj: new Date(current),
            dateString: dateStr,
            dayIndex,
            cityName: stop.city?.name || 'Unknown',
            expense: act.custom_cost || act.cost || act.defaultCost || 0
          });
        });

        // Add an empty day marker to preserve day structure
        if (dayActs.length === 0) {
          activities.push({
            _isEmptyDay: true,
            _dateObj: new Date(current),
            dateString: dateStr,
            dayIndex,
            cityName: stop.city?.name || 'Unknown',
            expense: 0
          });
        }

        dayIndex++;
        current.setDate(current.getDate() + 1);
      }
    });

    return activities;
  }, [itinerary]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    flatActivities.forEach(a => {
      if (!a._isEmptyDay && a.category) cats.add(a.category);
    });
    return Array.from(cats).sort();
  }, [flatActivities]);

  // 2. Filter, Search, and Sort
  const processedActivities = useMemo(() => {
    let result = [...flatActivities];

    // Filter
    if (filter !== 'All') {
      result = result.filter(a => a._isEmptyDay || a.category === filter);
    }

    // Search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(a => {
        if (a._isEmptyDay) return false;
        return (
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q) ||
          a.cityName?.toLowerCase().includes(q)
        );
      });
    }

    // Filter out empty days if we are NOT grouping by Day, or if we have active search/filters
    if (groupBy !== 'Day' || filter !== 'All' || debouncedSearch.trim()) {
      result = result.filter(a => !a._isEmptyDay);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'ExpenseAsc') return a.expense - b.expense;
      if (sortBy === 'ExpenseDesc') return b.expense - a.expense;
      
      // Default: Date -> time slot -> order
      if (a._dateObj?.getTime() !== b._dateObj?.getTime()) {
        return (a._dateObj?.getTime() || 0) - (b._dateObj?.getTime() || 0);
      }
      return 0; 
    });

    return result;
  }, [flatActivities, filter, debouncedSearch, groupBy, sortBy]);

  // 3. Group
  const groupedSections = useMemo(() => {
    const groups = {};

    processedActivities.forEach(act => {
      let key = 'Other';
      let title = '';
      let subtitle = '';

      if (groupBy === 'Day') {
        key = `Day ${act.dayIndex}`;
        title = `DAY ${String(act.dayIndex).padStart(2, '0')}`;
        subtitle = act._dateObj?.toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' }).toUpperCase() + (act.cityName ? ` · ${act.cityName.toUpperCase()}` : '');
      } else if (groupBy === 'City') {
        key = act.cityName;
        title = act.cityName.toUpperCase();
      } else if (groupBy === 'Category') {
        key = act.category || 'Uncategorized';
        title = key.toUpperCase();
      }

      if (!groups[key]) {
        groups[key] = { title, subtitle, activities: [], totalExpense: 0 };
      }
      
      if (!act._isEmptyDay) {
        groups[key].activities.push(act);
        groups[key].totalExpense += act.expense;
      }
    });

    return Object.values(groups);
  }, [processedActivities, groupBy]);

  // Auto-expand first day with activities by default
  useEffect(() => {
    if (!groupedSections || groupedSections.length === 0) return;

    setOpenSections(prev => {
      if (Object.keys(prev).length > 0) return prev;

      let defaultIdx = groupedSections.findIndex(sec => sec.activities && sec.activities.length > 0);
      if (defaultIdx === -1) defaultIdx = 0;

      return { [defaultIdx]: true };
    });
  }, [groupedSections]);

  const toggleSection = (idx) => {
    setOpenSections(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Budget Calc
  const totalPlannedExpenses = useMemo(() => {
    return flatActivities.reduce((sum, act) => sum + (act._isEmptyDay ? 0 : act.expense), 0);
  }, [flatActivities]);

  // Metadata Strings
  const dateRangeStr = useMemo(() => {
    const sStr = itinerary?.trip?.startDate;
    const eStr = itinerary?.trip?.endDate || sStr;
    if (!sStr) return '';
    try {
      const s = new Date(sStr);
      const e = new Date(eStr);
      if (isNaN(s.getTime())) return '';
      const sFormatted = s.toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' });
      const eFormatted = e.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
      return `${sFormatted} — ${eFormatted}`;
    } catch (e) {
      return '';
    }
  }, [itinerary]);

  const routeString = useMemo(() => {
    if (itinerary?.stops?.length) {
      const names = itinerary.stops.map(s => s.city?.name).filter(Boolean);
      if (names.length > 0) return names.join(' → ');
    }
    if (itinerary?.trip?.cities?.length) {
      const names = itinerary.trip.cities.map(c => c.name || c.cityName).filter(Boolean);
      if (names.length > 0) return names.join(' → ');
    }
    return null;
  }, [itinerary]);

  const destinationCount = useMemo(() => {
    if (itinerary?.stops?.length) return itinerary.stops.length;
    if (itinerary?.trip?.cities?.length) return itinerary.trip.cities.length;
    return 1;
  }, [itinerary]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Trip link copied to clipboard!');
    } else {
      toast.success('Sharing link ready.');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto pb-20 animate-pulse pt-6 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="h-6 w-28 bg-surface-muted mb-4 rounded-full"></div>
        <div className="h-10 w-3/4 bg-surface-muted mb-4 rounded-md"></div>
        <div className="h-16 w-full bg-surface-muted mb-6 rounded-xl"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-surface-muted mb-3 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="w-full max-w-[1400px] mx-auto pb-20 pt-12 text-center px-4 font-sans">
        <p className="text-secondary mb-6 text-sm font-sans">{error || 'Journey not found.'}</p>
        <Button onClick={() => navigate('/trips')} variant="secondary" className="!w-auto px-6 text-xs cursor-pointer font-sans">
          Return to My Trips
        </Button>
      </div>
    );
  }

  const selectedPlaceTitle = itinerary.trip?.title || 'Selected Place';

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Top Back Link */}
      <button 
        onClick={() => navigate('/trips')} 
        className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors font-medium mb-6 cursor-pointer font-sans"
      >
        <ArrowLeft size={14} /> My Trips
      </button>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b border-border-subtle/50">
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold tracking-wider text-terracotta uppercase block font-sans">
            JOURNEY ITINERARY
          </span>
          <h1 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl text-primary leading-tight">
            {selectedPlaceTitle}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm text-secondary font-medium pt-1 font-sans">
            {dateRangeStr && <span>{dateRangeStr}</span>}
            {dateRangeStr && <span className="text-stone/40">•</span>}
            <span>{destinationCount} {destinationCount === 1 ? 'destination' : 'destinations'}</span>
            {routeString && <span className="text-stone/40">•</span>}
            {routeString && <span className="text-primary font-semibold">{routeString}</span>}
          </div>
        </div>

        {/* Compact Header Actions */}
        <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0 font-sans">
          <Button 
            variant="secondary" 
            onClick={() => setIsCalendarOpen(true)} 
            className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-medium cursor-pointer font-sans shadow-2xs"
            aria-label="Open trip calendar"
          >
            <Calendar size={14} className="shrink-0 text-current" />
            <span>Calendar</span>
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/builder/${id}`)} 
            className="flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-medium cursor-pointer font-sans shadow-2xs"
            aria-label="Edit itinerary"
          >
            <Edit2 size={13} /> Edit
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleShare} 
            className="flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-medium cursor-pointer font-sans shadow-2xs"
            aria-label="Share journey"
          >
            <Share2 size={13} /> Share
          </Button>
        </div>
      </div>

      {/* Controls Bar */}
      <ItineraryToolbar 
        searchQuery={searchQuery} onSearchChange={setSearchQuery}
        groupBy={groupBy} onGroupByChange={setGroupBy}
        filter={filter} onFilterChange={setFilter}
        sortBy={sortBy} onSortByChange={setSortBy}
        categories={categories}
      />

      {/* Editorial Budget Snapshot */}
      <BudgetSummary 
        totalExpense={totalPlannedExpenses} 
        budget={itinerary.trip?.total_budget} 
        tripId={id}
      />

      {/* Main Itinerary Content */}
      <div className="mt-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display font-normal text-3xl sm:text-4xl text-primary">
            Your Itinerary
          </h2>
          <span className="font-sans text-xs sm:text-sm text-secondary font-medium">
            {groupedSections.length} {groupedSections.length === 1 ? 'section' : 'sections'} · {destinationCount} {destinationCount === 1 ? 'destination' : 'destinations'}
          </span>
        </div>

        {flatActivities.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border-subtle rounded-[var(--radius-2xl)] bg-surface-primary/40 px-6 font-sans">
            <p className="font-sans text-secondary text-xs sm:text-sm mb-4 leading-relaxed max-w-sm mx-auto">
              No activities planned for this itinerary yet.
            </p>
            <Button onClick={() => navigate(`/builder/${id}`)} className="!w-auto px-5 py-2 text-xs font-medium cursor-pointer font-sans">
              + Plan activities
            </Button>
          </div>
        ) : groupedSections.length === 0 ? (
          <div className="py-12 text-center text-secondary text-xs sm:text-sm border border-dashed border-border-subtle rounded-[var(--radius-2xl)] bg-surface-primary/40 font-sans">
            No activities match your filters.
          </div>
        ) : (
          <div className="space-y-3">
            {groupedSections.map((section, idx) => (
              <ItineraryDayAccordion
                key={idx}
                id={idx}
                section={section}
                isOpen={!!openSections[idx]}
                onToggle={() => toggleSection(idx)}
                tripId={id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Calendar Overlay */}
      <CalendarOverlay 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        trip={itinerary} 
      />

    </div>
  );
};

export default ItineraryViewPage;
