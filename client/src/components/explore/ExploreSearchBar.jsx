import { Search } from 'lucide-react';

const ExploreSearchBar = ({ query, onQueryChange, placeholder }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
      <input
        type="text"
        placeholder={placeholder || 'Search activities, cities, or tags...'}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-lg)] border border-border-default bg-surface-elevated focus:outline-none focus:border-terracotta transition-colors text-(length:--text-body-sm)"
      />
    </div>
  );
};

export default ExploreSearchBar;
