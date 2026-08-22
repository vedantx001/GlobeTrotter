import { Search } from 'lucide-react';
import Select from '../common/Select';

const ItineraryToolbar = ({ 
  searchQuery, onSearchChange,
  groupBy, onGroupByChange,
  filter, onFilterChange,
  sortBy, onSortByChange,
  categories = []
}) => {
  const groupOptions = [
    { value: 'Day', label: 'Day' },
    { value: 'City', label: 'City' },
    { value: 'Category', label: 'Category' },
  ];

  const filterOptions = [
    { value: 'All', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat, label: cat })),
  ];

  const sortOptions = [
    { value: 'Date', label: 'Default (Date)' },
    { value: 'ExpenseAsc', label: 'Expense: Low → High' },
    { value: 'ExpenseDesc', label: 'Expense: High → Low' },
  ];

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
          <Select 
            value={groupBy} 
            onChange={(e) => onGroupByChange(e.target.value)}
            options={groupOptions}
            size="sm"
            className="min-w-[110px]"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-stone font-medium whitespace-nowrap uppercase tracking-wider">Filter:</span>
          <Select 
            value={filter} 
            onChange={(e) => onFilterChange(e.target.value)}
            options={filterOptions}
            size="sm"
            className="min-w-[140px]"
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-stone font-medium whitespace-nowrap uppercase tracking-wider">Sort:</span>
          <Select 
            value={sortBy} 
            onChange={(e) => onSortByChange(e.target.value)}
            options={sortOptions}
            size="sm"
            className="min-w-[160px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ItineraryToolbar;
