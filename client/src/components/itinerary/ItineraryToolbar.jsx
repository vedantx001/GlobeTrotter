import { Search } from 'lucide-react';
import Select from '../common/Select';

const ItineraryToolbar = ({ 
  searchQuery, onSearchChange,
  groupBy, onGroupByChange,
  filter, onFilterChange,
  sortBy, onSortByChange,
  categories
}) => {
  const groupOptions = [
    { value: 'Day', label: 'Day' },
    { value: 'City', label: 'City' },
    { value: 'Category', label: 'Category' },
  ];

  const filterOptions = [
    { value: 'All', label: 'All Categories' },
    ...(categories || []).map(cat => ({ value: cat, label: cat })),
  ];

  const sortOptions = [
    { value: 'Date', label: 'Date / Default' },
    { value: 'ExpenseAsc', label: 'Expense: Low to High' },
    { value: 'ExpenseDesc', label: 'Expense: High to Low' },
  ];

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
          <Select 
            value={groupBy} 
            onChange={(e) => onGroupByChange(e.target.value)}
            options={groupOptions}
            size="sm"
            className="min-w-[130px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-(length:--text-caption) text-secondary font-medium uppercase tracking-wider whitespace-nowrap">Filter</label>
          <Select 
            value={filter} 
            onChange={(e) => onFilterChange(e.target.value)}
            options={filterOptions}
            size="sm"
            className="min-w-[150px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-(length:--text-caption) text-secondary font-medium uppercase tracking-wider whitespace-nowrap">Sort By</label>
          <Select 
            value={sortBy} 
            onChange={(e) => onSortByChange(e.target.value)}
            options={sortOptions}
            size="sm"
            className="min-w-[170px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ItineraryToolbar;
