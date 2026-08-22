import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  
  // Minimal fallback if no image
  const coverImage = trip.coverImage || trip.image || null;
  const destinationCount = trip.destinations?.length || trip.cities?.length || 1;
  const isUpcoming = new Date(trip.startDate) > new Date();
  
  return (
    <div 
      onClick={() => navigate(`/trips/${trip.id || trip._id}`)}
      className="group cursor-pointer bg-warm-white border border-border-subtle rounded-[var(--radius-2xl)] overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 w-full bg-surface-muted overflow-hidden">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={trip.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-warm-ash/40 to-stone/20 flex items-center justify-center text-secondary/50">
            <MapPin size={32} />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-[var(--radius-md)] text-(length:--text-caption) font-medium text-primary shadow-sm">
          {isUpcoming ? 'Upcoming' : 'Previous'}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display text-(length:--text-heading-sm) text-primary mb-2 line-clamp-1 group-hover:text-terracotta transition-colors">
          {trip.title}
        </h3>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 text-secondary text-(length:--text-body-sm)">
            <Calendar size={14} />
            <span>{trip.startDate ? new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Dates pending'}</span>
          </div>
          <div className="flex items-center gap-2 text-secondary text-(length:--text-body-sm)">
            <MapPin size={14} />
            <span>{destinationCount} Destination{destinationCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
