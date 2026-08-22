import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardTrips, getRecommendedDestinations } from '../api/dashboard_api';
import DashboardHero from '../components/dashboard/DashboardHero';
import DashboardStat from '../components/dashboard/DashboardStat';
import TripCard from '../components/dashboard/TripCard';
import DestinationCard from '../components/dashboard/DestinationCard';
import Button from '../components/common/Button';
import { Map, Plane } from 'lucide-react';

const REGIONS = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Middle East', 'Oceania'];

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('All');
  
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [tripsError, setTripsError] = useState(null);
  const [destinationsError, setDestinationsError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoadingTrips(true);
        const data = await getDashboardTrips();
        const tripsArray = data?.data || data?.trips || data || [];
        setTrips(Array.isArray(tripsArray) ? tripsArray : []);
      } catch (err) {
        setTripsError('Unable to load your trips at this time.');
      } finally {
        setLoadingTrips(false);
      }
    };
    
    fetchTrips();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoadingDestinations(true);
        const data = await getRecommendedDestinations(selectedRegion);
        const destArray = data?.data || data?.cities || data || [];
        setDestinations(Array.isArray(destArray) ? destArray : []);
      } catch (err) {
        setDestinationsError('Unable to load destinations.');
      } finally {
        setLoadingDestinations(false);
      }
    };
    
    fetchDestinations();
  }, [selectedRegion]);

  // Derived stats
  const totalTrips = trips.length;
  const upcomingTrips = trips.filter(t => new Date(t.startDate) > new Date()).length;
  // Calculate unique destinations from trips if available, otherwise just use trips count
  const destinationsExplored = trips.reduce((acc, t) => {
    const destCount = t.destinations?.length || t.cities?.length || 1;
    return acc + destCount;
  }, 0);

  return (
    <div className="w-full pb-10">
      <DashboardHero userName={user?.name || user?.firstName} />

      {/* Stats Section */}
      <section className="mb-16">
        <h2 className="text-(length:--text-body-sm) font-medium text-secondary uppercase tracking-widest mb-6">
          Your Travel Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          <DashboardStat label="Total Trips" value={loadingTrips ? '-' : totalTrips} />
          <DashboardStat label="Upcoming" value={loadingTrips ? '-' : upcomingTrips} />
          <DashboardStat label="Destinations" value={loadingTrips ? '-' : destinationsExplored} />
        </div>
      </section>

      {/* Your Journeys */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-(length:--text-heading-md) text-primary leading-none mb-2">
              Your Journeys
            </h2>
            <p className="text-secondary text-(length:--text-body)">
              Upcoming and recent expeditions.
            </p>
          </div>
          <div className="hidden sm:block">
            <Button onClick={() => navigate('/trips')} variant="primary" className="!w-auto bg-surface-elevated text-primary border border-border-subtle hover:bg-surface-muted shadow-sm">
              View all
            </Button>
          </div>
        </div>

        {loadingTrips ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 bg-surface-muted rounded-[var(--radius-2xl)] animate-pulse" />
            ))}
          </div>
        ) : tripsError ? (
          <div className="p-8 border border-border-default rounded-[var(--radius-2xl)] bg-surface-secondary text-center">
            <p className="text-secondary">{tripsError}</p>
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((trip, idx) => (
              <TripCard key={trip.id || trip._id || idx} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="py-16 px-6 border border-border-subtle rounded-[var(--radius-3xl)] bg-warm-white flex flex-col items-center justify-center text-center shadow-[var(--shadow-soft)]">
            <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mb-4 text-stone">
              <Plane size={24} />
            </div>
            <h3 className="font-display text-(length:--text-heading-sm) text-primary mb-2">
              No journeys yet.
            </h3>
            <p className="text-secondary text-(length:--text-body) max-w-sm mb-6">
              Start with somewhere you've always wanted to go.
            </p>
            <div className="w-fit">
              <Button onClick={() => navigate('/trips/new')} className="!w-auto px-6">
                Plan a new trip →
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Explore / Recommended Destinations */}
      <section>
        <div className="mb-8">
          <h2 className="font-display text-(length:--text-heading-md) text-primary leading-none mb-6">
            Explore Destinations
          </h2>
          
          {/* Region Selector */}
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 hide-scrollbar">
            {REGIONS.map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-(length:--text-body-sm) transition-colors border ${
                  selectedRegion === region 
                    ? 'bg-obsidian text-warm-white border-obsidian shadow-md' 
                    : 'bg-warm-white text-secondary border-border-subtle hover:border-border-strong hover:text-primary'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {loadingDestinations ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 md:h-72 bg-surface-muted rounded-[var(--radius-2xl)] animate-pulse" />
            ))}
          </div>
        ) : destinationsError ? (
          <div className="p-8 border border-border-default rounded-[var(--radius-2xl)] bg-surface-secondary text-center">
            <p className="text-secondary">{destinationsError}</p>
          </div>
        ) : destinations.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {destinations.slice(0, 8).map((dest, idx) => (
              <DestinationCard key={dest.id || dest._id || idx} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="py-12 px-6 border border-border-subtle rounded-[var(--radius-2xl)] bg-warm-white flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-surface-muted rounded-full flex items-center justify-center mb-3 text-stone">
              <Map size={20} />
            </div>
            <p className="text-primary font-medium mb-1">No destinations found.</p>
            <p className="text-secondary text-(length:--text-body-sm)">Try selecting a different region.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
