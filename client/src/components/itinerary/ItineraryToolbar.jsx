import { Search } from 'lucide-react';

const ItineraryToolbar = ({ 
  searchQuery, onSearchChange,
  groupBy, onGroupByChange,
  filter, onFilterChange,
  sortBy, onSortByChange,
  categories = []
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-y border-border-subtle/50 mb-8 font-sans">
      {/* Sleek Expanded Search Input */}
      <div className="relative w-full sm:w-[360px] md:w-[440px] lg:w-[480px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone/70" size={16} strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search activities, locations, categories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-8 py-2 rounded-full border border-border-subtle bg-surface-primary focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all text-sm text-primary placeholder:text-stone/50 shadow-2xs"
        />
        {searchQuery && (
          <button 
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-stone hover:text-primary transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Styled Filter Selects */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
        {/* Group By */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-stone font-medium whitespace-nowrap uppercase tracking-wider">Group:</span>
          <select 
            value={groupBy} 
            onChange={(e) => onGroupByChange(e.target.value)}
            className="text-xs font-medium border border-border-subtle rounded-full px-3 py-1.5 bg-surface-primary text-primary focus:outline-none focus:border-terracotta hover:border-border-strong cursor-pointer shadow-2xs transition-colors"
          >
            <option value="Day">Day</option>
            <option value="City">City</option>
            <option value="Category">Category</option>
          </select>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-stone font-medium whitespace-nowrap uppercase tracking-wider">Filter:</span>
          <select 
            value={filter} 
            onChange={(e) => onFilterChange(e.target.value)}
            className="text-xs font-medium border border-border-subtle rounded-full px-3 py-1.5 bg-surface-primary text-primary focus:outline-none focus:border-terracotta hover:border-border-strong cursor-pointer max-w-[160px] truncate shadow-2xs transition-colors"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-stone font-medium whitespace-nowrap uppercase tracking-wider">Sort:</span>
          <select 
            value={sortBy} 
            onChange={(e) => onSortByChange(e.target.value)}
            className="text-xs font-medium border border-border-subtle rounded-full px-3 py-1.5 bg-surface-primary text-primary focus:outline-none focus:border-terracotta hover:border-border-strong cursor-pointer shadow-2xs transition-colors"
          >
            <option value="Date">Default (Date)</option>
            <option value="ExpenseAsc">Expense: Low → High</option>
            <option value="ExpenseDesc">Expense: High → Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ItineraryToolbar;
