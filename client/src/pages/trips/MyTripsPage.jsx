import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTrips, deleteTrip, updateTrip } from '../../api/trips_api';
import TripCard from '../../components/trips/TripCard';
import TripFilter from '../../components/trips/TripFilter';
import DeleteTripDialog from '../../components/trips/DeleteTripDialog';
import EditTripModal from '../../components/trips/EditTripModal';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';

const MyTripsPage = () => {
  const navigate = useNavigate();
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const [tripToDelete, setTripToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [tripToEdit, setTripToEdit] = useState(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await getTrips();
      const tripsArray = data?.data || data?.trips || data || [];
      setTrips(Array.isArray(tripsArray) ? tripsArray : []);
    } catch (err) {
      setError('Unable to load your trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteConfirm = async (tripId) => {
    try {
      setIsDeleting(true);
      await deleteTrip(tripId);
      setTrips(prev => prev.filter(t => (t.id || t._id) !== tripId));
      setTripToDelete(null);
      toast.success('Trip deleted successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Unable to delete this trip.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveTrip = async (updatedTripPayload) => {
    try {
      const tripId = updatedTripPayload.id || updatedTripPayload._id;
      await updateTrip(tripId, updatedTripPayload);
      setTrips(prev => prev.map(t => (t.id || t._id) === tripId ? { ...t, ...updatedTripPayload } : t));
      setTripToEdit(null);
      toast.success('Trip updated successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Unable to update this trip.');
    }
  };

  // Client-side filtering, searching, and sorting
  const filteredTrips = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const list = trips.filter(trip => {
      // 1. Filter by status
      if (filter === 'Upcoming') {
        const startDate = new Date(trip.startDate);
        if (startDate < today) return false;
      } else if (filter === 'Completed') {
        const endDate = new Date(trip.endDate || trip.startDate);
        if (endDate >= today) return false;
      }
      
      // 2. Filter by search query
      if (debouncedSearchQuery.trim()) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesTitle = trip.title?.toLowerCase().includes(query);
        const matchesDest = trip.destinations?.some(d => d.name?.toLowerCase().includes(query)) ||
                            trip.cities?.some(c => (c.name || c.cityName)?.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesDest) return false;
      }
      
      return true;
    });

    // 3. Sort
    list.sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.startDate || 0) - new Date(a.startDate || 0);
      }
      if (sortBy === 'Oldest') {
        return new Date(a.startDate || 0) - new Date(b.startDate || 0);
      }
      if (sortBy === 'Title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'BudgetHigh') {
        return Number(b.total_budget ?? b.budget ?? 0) - Number(a.total_budget ?? a.budget ?? 0);
      }
      if (sortBy === 'BudgetLow') {
        return Number(a.total_budget ?? a.budget ?? 0) - Number(b.total_budget ?? b.budget ?? 0);
      }
      return 0;
    });

    return list;
  }, [trips, filter, debouncedSearchQuery, sortBy]);

  return (
    <div className="w-full pb-20 pt-2">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-border-subtle/50">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-terracotta uppercase mb-2 block">
            Personal Collection
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-primary leading-normal mb-3">
            My Trips
          </h1>
          <p className="text-secondary text-sm sm:text-base max-w-lg leading-relaxed">
            All the places you've planned, visited, or are about to discover.
          </p>
        </div>
        <div className="shrink-0">
          <Button 
            onClick={() => navigate('/trips/new')}
            className="!w-auto px-6 py-2.5 shadow-xs hover:shadow-md transition-all cursor-pointer text-xs font-medium"
          >
            + Plan a new trip
          </Button>
        </div>
      </div>

      {/* Controls: Segmented Filter, Search & Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <TripFilter currentFilter={filter} onFilterChange={setFilter} />
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" size={15} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-full border border-border-subtle bg-surface-primary focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30 transition-all text-xs text-primary placeholder:text-stone/60"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone hover:text-primary transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="w-full sm:w-48 shrink-0">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'Newest', label: 'Newest First' },
                { value: 'Oldest', label: 'Oldest First' },
                { value: 'Title', label: 'Title (A-Z)' },
                { value: 'BudgetHigh', label: 'Budget (High → Low)' },
                { value: 'BudgetLow', label: 'Budget (Low → High)' },
              ]}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Grid Section */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-surface-muted/60 rounded-[var(--radius-2xl)] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-12 border border-border-subtle rounded-[var(--radius-3xl)] bg-surface-primary text-center shadow-xs">
          <p className="text-secondary text-sm">{error}</p>
          <button 
            onClick={fetchTrips} 
            className="mt-4 text-terracotta hover:underline font-medium text-xs cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : trips.length === 0 ? (
        /* Empty Collection State */
        <div className="py-20 px-6 border border-border-subtle/80 rounded-[var(--radius-3xl)] bg-surface-primary flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-14 h-14 bg-surface-muted/80 rounded-full flex items-center justify-center mb-5 text-stone border border-border-subtle">
            <Plane size={22} strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-2xl text-primary mb-2">
            No trips planned yet
          </h3>
          <p className="text-secondary text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
            Start curating your next adventure by selecting destinations, scheduling stops, and organizing your timeline.
          </p>
          <Button onClick={() => navigate('/trips/new')} className="!w-auto px-6 py-2.5 text-xs font-medium cursor-pointer">
            + Plan a new trip
          </Button>
        </div>
      ) : filteredTrips.length === 0 ? (
        /* Empty Filter/Search State */
        <div className="py-16 px-6 text-center border border-dashed border-border-subtle rounded-[var(--radius-2xl)] bg-surface-primary/40">
          <h4 className="font-display text-xl text-primary mb-2">
            {debouncedSearchQuery ? 'No matching trips found' : `No ${filter.toLowerCase()} trips`}
          </h4>
          <p className="text-secondary text-xs sm:text-sm max-w-sm mx-auto mb-4 leading-relaxed">
            {debouncedSearchQuery 
              ? `We couldn't find any trips matching "${debouncedSearchQuery}".`
              : `You don't have any ${filter.toLowerCase()} trips in your collection.`}
          </p>
          {debouncedSearchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-medium text-terracotta hover:underline cursor-pointer"
            >
              Clear search query
            </button>
          )}
        </div>
      ) : (
        /* Trips Collection Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTrips.map(trip => (
            <TripCard 
              key={trip.id || trip._id} 
              trip={trip} 
              onEdit={(selectedTrip) => setTripToEdit(selectedTrip)}
              onDelete={() => setTripToDelete(trip)}
              onShare={() => {}} // Disabled for now
            />
          ))}
        </div>
      )}

      {/* Edit Trip Modal */}
      <EditTripModal
        isOpen={!!tripToEdit}
        trip={tripToEdit}
        onClose={() => setTripToEdit(null)}
        onSave={handleSaveTrip}
      />

      {/* Delete Confirmation Modal */}
      <DeleteTripDialog
        isOpen={!!tripToDelete}
        trip={tripToDelete}
        isDeleting={isDeleting}
        onClose={() => setTripToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
};

export default MyTripsPage;
