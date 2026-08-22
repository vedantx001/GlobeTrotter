import { MapPin } from 'lucide-react';

const TripSuggestionCard = ({ suggestion, onUse }) => {
  const imageUrl = suggestion.image || suggestion.imageUrl || null;
  const name = suggestion.name || suggestion.city;
  const country = suggestion.country;
  
  return (
    <div className="group rounded-[var(--radius-2xl)] overflow-hidden relative h-56 min-w-[200px] w-full flex-shrink-0 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-shadow">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-surface-muted flex items-center justify-center text-stone/40">
          <MapPin size={32} />
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end">
        <h4 className="font-display text-(length:--text-heading-sm) text-white mb-0.5 drop-shadow-sm line-clamp-1">
          {name}
        </h4>
        <span className="text-white/80 text-(length:--text-body-sm) drop-shadow-sm line-clamp-1 mb-2">
          {country}
        </span>
        {onUse && (
          <button 
            type="button"
            onClick={() => onUse(name)}
            className="w-fit text-(length:--text-caption) bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full transition-colors"
          >
            Use destination
          </button>
        )}
      </div>
    </div>
  );
};

export default TripSuggestionCard;
