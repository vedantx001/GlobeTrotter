import { MapPin, TrendingUp } from 'lucide-react';

const CityResultCard = ({ city, onClick }) => {
  // Generate cost index string ($, $$, $$$)
  const costString = Array(city.costIndex).fill('$').join('');

  return (
    <div 
      onClick={() => onClick(city)}
      className="group cursor-pointer bg-surface-primary border border-border-subtle rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all flex flex-col h-full relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-display text-(length:--text-heading-sm) text-primary group-hover:text-terracotta transition-colors">
          {city.name}
        </h3>
        <div className="flex items-center gap-1 bg-surface-muted text-secondary px-2 py-1 rounded-md shrink-0">
          <TrendingUp size={14} />
          <span className="text-xs font-medium">{city.popularityScore}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 text-xs font-medium text-secondary mb-4 uppercase tracking-wider">
        <MapPin size={12} />
        <span>{city.region}, {city.country?.name}</span>
      </div>
      
      <p className="text-sm text-stone line-clamp-3 mb-4 flex-1">
        {city.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {city.tags?.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] bg-surface-muted text-secondary px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-auto text-sm font-medium text-primary">
        <span>Cost Index:</span>
        <span className="text-terracotta">{costString}</span>
      </div>
    </div>
  );
};

export default CityResultCard;
