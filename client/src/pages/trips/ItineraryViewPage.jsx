import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripItinerary } from '../../api/trips_api';
import Button from '../../components/common/Button';
import { ArrowLeft, Edit2 } from 'lucide-react';
import ItineraryToolbar from '../../components/itinerary/ItineraryToolbar';
import ItineraryActivityRow from '../../components/itinerary/ItineraryActivityRow';
import BudgetSummary from '../../components/itinerary/BudgetSummary';

const ItineraryViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [groupBy, setGroupBy] = useState('Day');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Date');

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
        title = `DAY ${act.dayIndex}`;
        subtitle = act._dateObj?.toLocaleDateString(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' }) + (act.cityName ? ` • ${act.cityName}` : '');
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

  // Budget Calc
  const totalPlannedExpenses = useMemo(() => {
    return flatActivities.reduce((sum, act) => sum + (act._isEmptyDay ? 0 : act.expense), 0);
  }, [flatActivities]);


  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto pb-20 animate-pulse pt-6">
        <div className="h-10 w-48 bg-surface-muted mb-8 rounded"></div>
        <div className="h-16 w-full bg-surface-muted mb-12 rounded-[var(--radius-xl)]"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-surface-muted mb-6 rounded-md"></div>
        ))}
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="w-full max-w-6xl mx-auto pb-20 pt-12 text-center">
        <p className="text-secondary mb-6">{error || 'Journey not found.'}</p>
        <Button onClick={() => navigate('/trips')} variant="secondary">Return to My Trips</Button>
      </div>
    );
  }

  const selectedPlaceTitle = itinerary.trip?.title || 'Selected Place';

  return (
    <div className="w-full max-w-6xl mx-auto pb-24 pt-6">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/trips')} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> My Trips
        </button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate(`/builder/${id}`)} className="flex items-center gap-2 !px-4">
            <Edit2 size={14} /> Edit itinerary
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <ItineraryToolbar 
        searchQuery={searchQuery} onSearchChange={setSearchQuery}
        groupBy={groupBy} onGroupByChange={setGroupBy}
        filter={filter} onFilterChange={setFilter}
        sortBy={sortBy} onSortByChange={setSortBy}
        categories={categories}
      />

      {/* Selected Place Header */}
      <h1 className="font-display text-(length:--text-heading-md) text-primary mb-8 border-b border-border-default pb-4">
        Itinerary for {selectedPlaceTitle}
      </h1>

      <BudgetSummary totalExpense={totalPlannedExpenses} budget={itinerary.trip?.total_budget} />

      {flatActivities.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-border-strong rounded-[var(--radius-2xl)]">
          <p className="text-secondary mb-6">No activities planned yet.</p>
          <Button onClick={() => navigate(`/builder/${id}`)}>Edit itinerary →</Button>
        </div>
      ) : groupedSections.length === 0 ? (
        <div className="py-16 text-center text-secondary border border-dashed border-border-strong rounded-[var(--radius-2xl)]">
          No activities match your filters.
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {groupedSections.map((section, idx) => (
            <div key={idx}>
              {/* Section Header */}
              <div className="flex items-end justify-between border-b-2 border-border-strong pb-2 mb-2">
                <div>
                  <h3 className="font-display text-(length:--text-heading-sm) text-primary leading-none">
                    {section.title}
                  </h3>
                  {section.subtitle && (
                    <span className="text-(length:--text-caption) text-secondary font-bold uppercase tracking-widest mt-1.5 block">
                      {section.subtitle}
                    </span>
                  )}
                </div>
                {section.totalExpense > 0 && (
                  <div className="text-(length:--text-body) font-medium text-stone">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(section.totalExpense)}
                  </div>
                )}
              </div>

              {/* Table Column Headers (Desktop) */}
              {section.activities.length > 0 && (
                <div className="hidden sm:flex justify-between text-[10px] font-bold text-secondary uppercase tracking-widest px-4 pb-2 border-b border-border-subtle pt-2">
                  <div>Physical Activity</div>
                  <div>Expense</div>
                </div>
              )}

              {/* Activities */}
              <div className="flex flex-col">
                {section.activities.length === 0 ? (
                  <div className="py-4 text-secondary/70 text-(length:--text-body-sm) italic px-4 border-b border-border-subtle">
                    No activities planned for this day.
                  </div>
                ) : (
                  section.activities.map(act => (
                    <ItineraryActivityRow key={act.id || act._id} activity={act} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryViewPage;
