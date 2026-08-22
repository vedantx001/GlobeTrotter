import { Star, MapPin, Clock, IndianRupee } from 'lucide-react';

const ActivityResultCard = ({ place, onClick }) => {
  return (
    <div 
      onClick={() => onClick(place)}
      className="group cursor-pointer bg-surface-primary border border-border-subtle rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all flex flex-col h-full relative overflow-hidden"
    >
      {/* Category Tag */}
      <div className="absolute top-0 right-0 bg-surface-muted px-3 py-1 text-[10px] font-bold text-secondary uppercase tracking-wider rounded-bl-[var(--radius-lg)] border-l border-b border-border-subtle">
        {place.activity?.category}
      </div>

      <div className="flex justify-between items-start mb-2 pr-20">
        <h3 className="font-display text-(length:--text-heading-sm) text-primary group-hover:text-terracotta transition-colors line-clamp-2">
          {place.name}
        </h3>
      </div>
      
      <div className="text-sm font-medium text-primary mb-1">
        {place.activity?.title || 'Activity'}
      </div>
      
      <div className="flex items-center gap-1 text-xs text-secondary mb-4">
        <MapPin size={12} />
        <span>{place.city?.name}, {place.country?.name}</span>
      </div>
      
      <p className="text-sm text-stone line-clamp-2 mb-4 flex-1">
        {place.description}
      </p>
      
      <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-auto">
        <div className="flex items-center gap-4 text-sm text-primary font-medium">
          <div className="flex items-center gap-1">
            <IndianRupee size={14} className="text-secondary" />
            <span>{place.estimatedCost}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-secondary" />
            <span>{place.durationHours}h</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-terracotta/10 text-terracotta px-2.5 py-1 rounded-md shrink-0">
          <Star size={14} className="fill-current" />
          <span className="text-xs font-bold">{place.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityResultCard;
