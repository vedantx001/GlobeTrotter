import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, MoreHorizontal, Eye, Edit2, Share, Trash2 } from 'lucide-react';

const TripCard = ({ trip, onEdit, onDelete, onShare }) => {
  const navigate = useNavigate();
  
  // Minimal fallback if no image
  const coverImage = trip.coverImage || trip.image || null;
  const destinationCount = trip.destinations?.length || trip.cities?.length || 1;
  const isUpcoming = new Date(trip.startDate) > new Date();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCardClick = (e) => {
    // Prevent navigation if clicking inside the menu area
    if (menuRef.current && menuRef.current.contains(e.target)) return;
    navigate(`/trips/${trip.id || trip._id}`);
  };

  const hasActions = onEdit || onDelete; // We'll always show Share if onEdit/onDelete exist (meaning it's the My Trips view)

  return (
    <div 
      onClick={handleCardClick}
      className="group cursor-pointer bg-warm-white border border-border-subtle rounded-[var(--radius-2xl)] overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300 flex flex-col h-full relative"
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
            {trip.endDate && (
              <span className="hidden sm:inline"> — {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-secondary text-(length:--text-body-sm)">
            <MapPin size={14} />
            <span>{destinationCount} Destination{destinationCount !== 1 ? 's' : ''}</span>
          </div>
          {trip.total_budget && (
            <div className="text-(length:--text-body-sm) font-medium text-stone mt-2 pt-2 border-t border-border-subtle">
              Budget: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(trip.total_budget)}
            </div>
          )}
        </div>
      </div>

      {/* Action Menu */}
      {hasActions && (
        <div className="absolute bottom-4 right-4 z-10" ref={menuRef}>
          <button 
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-2 bg-white/80 backdrop-blur-md border border-border-subtle text-secondary hover:text-primary hover:bg-white rounded-full shadow-sm transition-all"
          >
            <MoreHorizontal size={18} />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-40 bg-white border border-border-subtle rounded-[var(--radius-xl)] shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="py-1 flex flex-col">
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id || trip._id}`); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-surface-muted transition-colors text-left"
                >
                  <Eye size={14} /> View Details
                </button>
                {onEdit && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(trip); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-surface-muted transition-colors text-left"
                  >
                    <Edit2 size={14} /> Edit Trip
                  </button>
                )}
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (onShare) { onShare(trip); setMenuOpen(false); }
                  }}
                  disabled={!onShare}
                  title={!onShare ? "Sharing will be available once this journey is published." : "Share Trip"}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    onShare 
                      ? "text-secondary hover:text-primary hover:bg-surface-muted" 
                      : "text-secondary/40 cursor-not-allowed"
                  }`}
                >
                  <Share size={14} /> Share Trip
                </button>
                {onDelete && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(trip); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-soft transition-colors text-left border-t border-border-subtle mt-1 pt-2"
                  >
                    <Trash2 size={14} /> Delete Trip
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripCard;
