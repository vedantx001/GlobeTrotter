import { Search } from 'lucide-react';

const ItineraryToolbar = ({ 
  searchQuery, onSearchChange,
  groupBy, onGroupByChange,
  filter, onFilterChange,
  sortBy, onSortByChange,
  categories
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-surface-muted p-4 rounded-[var(--radius-xl)] border border-border-subtle">
      {/* Search */}
      <div className="relative w-full lg:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
        <input
          type="text"
          placeholder="Search itinerary..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-[var(--radius-md)] border border-border-default bg-surface-elevated focus:outline-none focus:border-terracotta transition-colors text-(length:--text-body-sm)"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex items-center gap-2">
          <label className="text-(length:--text-caption) text-secondary font-medium uppercase tracking-wider whitespace-nowrap">Group By</label>
          <select 
            value={groupBy} 
            onChange={(e) => onGroupByChange(e.target.value)}
            className="text-(length:--text-body-sm) border border-border-default rounded-[var(--radius-sm)] px-2 py-1.5 bg-surface-elevated focus:outline-none focus:border-terracotta min-w-[120px]"
          >
            <option value="Day">Day</option>
            <option value="City">City</option>
            <option value="Category">Category</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-(length:--text-caption) text-secondary font-medium uppercase tracking-wider whitespace-nowrap">Filter</label>
          <select 
            value={filter} 
            onChange={(e) => onFilterChange(e.target.value)}
            className="text-(length:--text-body-sm) border border-border-default rounded-[var(--radius-sm)] px-2 py-1.5 bg-surface-elevated focus:outline-none focus:border-terracotta min-w-[140px]"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-(length:--text-caption) text-secondary font-medium uppercase tracking-wider whitespace-nowrap">Sort By</label>
          <select 
            value={sortBy} 
            onChange={(e) => onSortByChange(e.target.value)}
            className="text-(length:--text-body-sm) border border-border-default rounded-[var(--radius-sm)] px-2 py-1.5 bg-surface-elevated focus:outline-none focus:border-terracotta min-w-[160px]"
          >
            <option value="Date">Date / Default</option>
            <option value="ExpenseAsc">Expense: Low to High</option>
            <option value="ExpenseDesc">Expense: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ItineraryToolbar;
