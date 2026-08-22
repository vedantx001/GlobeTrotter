import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTrips, deleteTrip } from '../../api/trips_api';
import TripCard from '../../components/trips/TripCard';
import TripFilter from '../../components/trips/TripFilter';
import DeleteTripDialog from '../../components/trips/DeleteTripDialog';
import Button from '../../components/common/Button';

const MyTripsPage = () => {
  const navigate = useNavigate();
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filter, setFilter] = useState('All');
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

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await getTrips();
      const tripsArray = data?.data || data?.trips || data || [];
      setTrips(Array.isArray(tripsArray) ? tripsArray : []);
    } catch (err) {
      setError('Unable to load your journeys.');
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
      toast.success('Journey deleted successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Unable to delete this journey.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Client-side filtering and searching
  const filteredTrips = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return trips.filter(trip => {
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
        // Optional: match destinations if data exists
        const matchesDest = trip.destinations?.some(d => d.name?.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesDest) return false;
      }
      
      return true;
    });
  }, [trips, filter, debouncedSearchQuery]);

  return (
    <div className="w-full pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pt-6">
        <div>
          <h1 className="font-display text-(length:--text-heading-xl) text-primary leading-none mb-4">
            My journeys
          </h1>
          <p className="text-(length:--text-body-lg) text-secondary max-w-md">
            All the places you've planned, visited, or are about to discover.
          </p>
        </div>
        <div className="shrink-0">
          <Button onClick={() => navigate('/trips/new')}>
            + Plan a new trip
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <TripFilter currentFilter={filter} onFilterChange={setFilter} />
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
          <input
            type="text"
            placeholder="Search journeys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-border-default bg-surface-elevated focus:outline-none focus:border-terracotta transition-colors text-(length:--text-body-sm)"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-surface-muted rounded-[var(--radius-2xl)] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-12 border border-border-default rounded-[var(--radius-3xl)] bg-surface-secondary text-center">
          <p className="text-secondary">{error}</p>
          <button onClick={fetchTrips} className="mt-4 text-terracotta hover:underline font-medium">Try again</button>
        </div>
      ) : trips.length === 0 ? (
        <div className="py-24 px-6 border border-border-subtle rounded-[var(--radius-3xl)] bg-warm-white flex flex-col items-center justify-center text-center shadow-[var(--shadow-soft)]">
          <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mb-6 text-stone">
            <Plane size={24} />
          </div>
          <h3 className="font-display text-(length:--text-heading-md) text-primary mb-3">
            No journeys yet.
          </h3>
          <p className="text-secondary text-(length:--text-body) max-w-sm mb-8">
            Start planning somewhere you've always wanted to go.
          </p>
          <Button onClick={() => navigate('/trips/new')}>
            Plan a new trip →
          </Button>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="py-16 text-center text-secondary border border-dashed border-border-strong rounded-[var(--radius-3xl)]">
          {debouncedSearchQuery ? `No journeys match "${debouncedSearchQuery}".` : `No ${filter.toLowerCase()} journeys found.`}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <TripCard 
              key={trip.id || trip._id} 
              trip={trip} 
              onEdit={() => navigate(`/trips/${trip.id || trip._id}/edit`)}
              onDelete={() => setTripToDelete(trip)}
              onShare={() => {}} // Disabled for now
            />
          ))}
        </div>
      )}

      {/* Modals */}
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
