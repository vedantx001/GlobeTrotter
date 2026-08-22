import { Search } from 'lucide-react';
import Select from '../common/Select';

const CommunityToolbar = ({
  searchQuery, onSearchChange,
  groupBy, onGroupByChange,
  filter, onFilterChange,
  sortBy, onSortByChange
}) => {
  const groupOptions = [
    { value: 'Destination', label: 'Destination' },
    { value: 'User', label: 'User' },
    { value: 'Trip', label: 'Trip' },
  ];

  const filterOptions = [
    { value: 'All', label: 'All Feed' },
    { value: 'Recent', label: 'Recent Only' },
  ];

  const sortOptions = [
    { value: 'Newest', label: 'Newest First' },
    { value: 'Oldest', label: 'Oldest First' },
  ];

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
          <Select 
            value={groupBy} 
            onChange={(e) => onGroupByChange(e.target.value)}
            options={groupOptions}
            size="sm"
            className="min-w-[140px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] sm:text-(length:--text-caption) text-secondary font-bold uppercase tracking-wider whitespace-nowrap">Filter</label>
          <Select 
            value={filter} 
            onChange={(e) => onFilterChange(e.target.value)}
            options={filterOptions}
            size="sm"
            className="min-w-[130px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] sm:text-(length:--text-caption) text-secondary font-bold uppercase tracking-wider whitespace-nowrap">Sort By</label>
          <Select 
            value={sortBy} 
            onChange={(e) => onSortByChange(e.target.value)}
            options={sortOptions}
            size="sm"
            className="min-w-[150px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityToolbar;

