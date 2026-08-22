import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, MoreHorizontal, Eye, Edit2, Share, Trash2, Compass } from 'lucide-react';

const TripCard = ({ trip, onEdit, onDelete, onShare }) => {
  const navigate = useNavigate();
  
  const coverImage = trip.coverImage || trip.image || null;
  const destinationCount = trip.destinations?.length || trip.cities?.length || trip.stops?.length || 1;
  
  // Calculate status: Upcoming, Ongoing, Completed
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = trip.startDate ? new Date(trip.startDate) : null;
  const endDate = trip.endDate ? new Date(trip.endDate) : startDate;
  
  let statusText = 'Upcoming';
  if (startDate) {
    if (endDate && today > endDate) {
      statusText = 'Completed';
    } else if (today >= startDate && (!endDate || today <= endDate)) {
      statusText = 'Ongoing';
    } else {
      statusText = 'Upcoming';
    }
  }

  const statusBadgeStyle = {
    Upcoming: 'bg-surface-primary/95 text-primary border-border-subtle/80',
    Ongoing: 'bg-terracotta/10 text-terracotta border-terracotta/30 font-semibold',
    Completed: 'bg-surface-muted/90 text-stone border-border-subtle/60'
  }[statusText] || 'bg-surface-primary/95 text-primary border-border-subtle';
  
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
    if (menuRef.current && menuRef.current.contains(e.target)) return;
    navigate(`/trips/${trip.id || trip._id}`);
  };

  const hasActions = onEdit || onDelete;

  // Format dates
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const startFormatted = formatDate(trip.startDate);
  const endFormatted = formatDate(trip.endDate);

  return (
    <div 
      onClick={handleCardClick}
      className="group cursor-pointer bg-surface-primary border border-border-subtle rounded-[var(--radius-2xl)] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-border-default transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Image / Fallback Container */}
      <div className="relative aspect-[16/10] w-full bg-warm-white overflow-hidden border-b border-border-subtle/40">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={trip.title} 
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
          />
        ) : (
          /* Editorial Fallback Graphic */
          <div className="w-full h-full bg-gradient-to-b from-warm-white to-surface-muted/40 p-6 flex flex-col justify-between relative overflow-hidden select-none">
            {/* Background Monogram Watermark */}
            <span className="absolute right-3 bottom-0 font-display italic text-8xl text-stone/10 font-bold leading-none pointer-events-none">
              {(trip.title || 'T').charAt(0)}
            </span>
            <div className="flex items-center justify-between text-secondary/60">
              <Compass size={20} strokeWidth={1.25} />
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone/70">
                GLOBETROTTER
              </span>
            </div>
            <div className="relative z-10">
              <span className="font-display italic text-lg text-secondary/80 line-clamp-1">
                {trip.destinations?.[0]?.name || trip.cities?.[0]?.name || 'Journey Itinerary'}
              </span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide border shadow-xs backdrop-blur-md ${statusBadgeStyle}`}>
          {statusText}
        </div>
      </div>
      
      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-2xl text-primary mb-3 leading-tight group-hover:text-terracotta transition-colors line-clamp-2">
            {trip.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2.5 text-secondary text-(length:--text-body-sm)">
              <Calendar size={14} className="text-stone shrink-0" strokeWidth={1.5} />
              <span className="truncate">
                {startFormatted ? (
                  <>
                    {startFormatted}
                    {endFormatted && endFormatted !== startFormatted && ` — ${endFormatted}`}
                  </>
                ) : (
                  'Dates pending'
                )}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-secondary text-(length:--text-body-sm)">
              <MapPin size={14} className="text-stone shrink-0" strokeWidth={1.5} />
              <span>{destinationCount} Destination{destinationCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Budget Footer */}
        {trip.total_budget ? (
          <div className="pt-3.5 border-t border-border-subtle/60 flex items-center justify-between mt-auto">
            <span className="text-[10px] font-bold tracking-widest text-secondary uppercase">
              Budget
            </span>
            <span className="font-display text-lg font-medium text-primary">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(trip.total_budget)}
            </span>
          </div>
        ) : null}
      </div>

      {/* Action Menu */}
      {hasActions && (
        <div className="absolute top-3.5 right-3.5 z-10" ref={menuRef}>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-2 bg-surface-primary/90 backdrop-blur-md border border-border-subtle/80 text-secondary hover:text-primary hover:bg-surface-primary rounded-full shadow-xs transition-all cursor-pointer focus:outline-none"
            aria-label="Trip actions"
          >
            <MoreHorizontal size={16} strokeWidth={1.5} />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-surface-primary border border-border-subtle rounded-[var(--radius-xl)] shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
              <div className="py-1 flex flex-col">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id || trip._id}`); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-secondary hover:text-primary hover:bg-surface-muted/60 transition-colors text-left cursor-pointer"
                >
                  <Eye size={14} strokeWidth={1.5} /> View Details
                </button>
                {onEdit && (
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onEdit(trip); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-secondary hover:text-primary hover:bg-surface-muted/60 transition-colors text-left cursor-pointer"
                  >
                    <Edit2 size={14} strokeWidth={1.5} /> Edit Trip
                  </button>
                )}
                <button 
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (onShare) { onShare(trip); setMenuOpen(false); }
                  }}
                  disabled={!onShare}
                  title={!onShare ? "Sharing will be available once this trip is published." : "Share Trip"}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-left transition-colors ${
                    onShare 
                      ? "text-secondary hover:text-primary hover:bg-surface-muted/60 cursor-pointer" 
                      : "text-stone/40 cursor-not-allowed"
                  }`}
                >
                  <Share size={14} strokeWidth={1.5} /> Share Trip
                </button>
                {onDelete && (
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(trip); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-danger hover:bg-danger-soft/60 transition-colors text-left border-t border-border-subtle/60 mt-1 cursor-pointer"
                  >
                    <Trash2 size={14} strokeWidth={1.5} /> Delete Trip
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
