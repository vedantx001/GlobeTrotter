import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTrips } from '../../api/trips_api';
import TripCard from '../../components/trips/TripCard';
import Button from '../../components/common/Button';
import ProfileEditForm from '../../components/profile/ProfileEditForm';
import { MapPin, Mail, Phone, Edit2, RefreshCcw } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrips();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load trips for profile:', err);
      setError('Unable to load your trips. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  // Compute trip categories based on start date
  const now = new Date();
  const preplannedTrips = trips.filter(t => new Date(t.startDate) > now);
  const previousTrips = trips.filter(t => new Date(t.startDate) <= now);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-6xl mx-auto pb-24">
      
      {/* Profile Header Section */}
      <div className="bg-surface-primary rounded-[var(--radius-3xl)] p-6 sm:p-8 md:p-10 mb-12 border border-border-default shadow-[var(--shadow-soft)] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative overflow-hidden">
        
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Left Side: Avatar + Vertically Centered Details */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 z-10 text-center sm:text-left w-full md:w-auto">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-display text-3xl sm:text-4xl overflow-hidden border-4 border-surface-primary shadow-sm">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(user.name)
            )}
          </div>

          {/* User Details (Vertically centered with avatar in row) */}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl font-display font-medium text-primary tracking-tight leading-tight">
              {user.name || 'Traveler'}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1.5 text-(length:--text-body-sm) text-secondary mt-2">
              <div className="flex items-center gap-1.5">
                <Mail size={15} className="text-secondary" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone size={15} className="text-secondary" />
                  <span>{user.phone}</span>
                </div>
              )}
              {(user.city || user.country) && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-secondary" />
                  <span>
                    {[user.city, user.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {user.bio && (
              <p className="mt-2.5 text-(length:--text-body-sm) text-stone italic max-w-xl line-clamp-2">
                "{user.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Edit Profile Button */}
        <div className="shrink-0 z-10 w-full sm:w-auto flex justify-center sm:justify-end">
          <Button 
            variant="secondary" 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2 text-sm w-full sm:w-auto"
          >
            <Edit2 size={15} /> Edit Profile
          </Button>
        </div>
      </div>

      {/* Trip Lists */}
      {error ? (
        <div className="w-full max-w-2xl mx-auto py-24 px-6 text-center border border-dashed border-border-strong rounded-[var(--radius-3xl)] bg-surface-primary shadow-sm">
          <p className="text-secondary text-(length:--text-body-lg) mb-8 font-medium">{error}</p>
          <Button onClick={loadTrips} variant="secondary" className="flex items-center justify-center gap-2 mx-auto">
            <RefreshCcw size={16} /> Retry Connection
          </Button>
        </div>
      ) : loading ? (
        <div className="space-y-16 animate-pulse">
          <div>
            <div className="h-8 w-64 bg-surface-muted rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-surface-muted rounded-[var(--radius-2xl)]"></div>)}
            </div>
          </div>
          <div>
            <div className="h-8 w-64 bg-surface-muted rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-surface-muted rounded-[var(--radius-2xl)]"></div>)}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-16">
          
          {/* Preplanned Trips */}
          <section>
            <h2 className="font-display text-(length:--text-heading-lg) text-primary mb-8 border-b border-border-subtle pb-4">
              Preplanned Trips
            </h2>
            {preplannedTrips.length === 0 ? (
              <div className="py-16 text-center text-secondary border border-dashed border-border-strong rounded-[var(--radius-2xl)] bg-surface-primary">
                <p className="mb-6">No trips planned yet.</p>
                <Button variant="secondary" onClick={() => navigate('/trips/new')}>Plan a trip</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {preplannedTrips.map(trip => (
                  <TripCard key={trip.id || trip._id} trip={trip} />
                ))}
              </div>
            )}
          </section>

          {/* Previous Trips */}
          <section>
            <h2 className="font-display text-(length:--text-heading-lg) text-primary mb-8 border-b border-border-subtle pb-4">
              Previous Trips
            </h2>
            {previousTrips.length === 0 ? (
              <div className="py-16 text-center text-secondary border border-dashed border-border-strong rounded-[var(--radius-2xl)] bg-surface-primary">
                No completed trips yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {previousTrips.map(trip => (
                  <TripCard key={trip.id || trip._id} trip={trip} />
                ))}
              </div>
            )}
          </section>

        </div>
      )}

      {/* Edit Profile Modal */}
      <ProfileEditForm 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
