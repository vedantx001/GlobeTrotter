import { Search } from 'lucide-react';

const CommunityToolbar = ({
  searchQuery, onSearchChange,
  groupBy, onGroupByChange,
  filter, onFilterChange,
  sortBy, onSortByChange
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-surface-muted p-4 sm:px-6 rounded-[var(--radius-2xl)] border border-border-subtle h-full">
      {/* Search */}
      <div className="relative w-full xl:w-64 2xl:max-w-xs shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
        <input
          type="text"
          placeholder="Search for ..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-lg)] border border-border-default bg-surface-elevated focus:outline-none focus:border-terracotta transition-colors text-(length:--text-body-sm)"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 xl:gap-5 overflow-x-auto pb-1 xl:pb-0 scrollbar-hide">
        <div className="flex items-center gap-2">
          <label className="text-[10px] sm:text-(length:--text-caption) text-secondary font-bold uppercase tracking-wider whitespace-nowrap">Group By</label>
          <select 
            value={groupBy} 
            onChange={(e) => onGroupByChange(e.target.value)}
            className="text-(length:--text-body-sm) border border-border-default rounded-[var(--radius-md)] px-3 py-1.5 bg-surface-elevated focus:outline-none focus:border-terracotta min-w-[130px] shadow-sm"
          >
            <option value="Destination">Destination</option>
            <option value="User">User</option>
            <option value="Trip">Trip</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] sm:text-(length:--text-caption) text-secondary font-bold uppercase tracking-wider whitespace-nowrap">Filter</label>
          <select 
            value={filter} 
            onChange={(e) => onFilterChange(e.target.value)}
            className="text-(length:--text-body-sm) border border-border-default rounded-[var(--radius-md)] px-3 py-1.5 bg-surface-elevated focus:outline-none focus:border-terracotta min-w-[120px] shadow-sm"
          >
            <option value="All">All Feed</option>
            <option value="Recent">Recent Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] sm:text-(length:--text-caption) text-secondary font-bold uppercase tracking-wider whitespace-nowrap">Sort By</label>
          <select 
            value={sortBy} 
            onChange={(e) => onSortByChange(e.target.value)}
            className="text-(length:--text-body-sm) border border-border-default rounded-[var(--radius-md)] px-3 py-1.5 bg-surface-elevated focus:outline-none focus:border-terracotta min-w-[140px] shadow-sm"
          >
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CommunityToolbar;
