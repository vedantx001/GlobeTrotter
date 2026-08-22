const TripFilter = ({ currentFilter, onFilterChange }) => {
  const filters = ['All', 'Upcoming', 'Completed'];

  return (
    <div className="inline-flex items-center p-1 bg-surface-muted/70 border border-border-subtle rounded-full backdrop-blur-xs">
      {filters.map((filter) => {
        const isActive = currentFilter === filter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`px-5 py-1.5 rounded-full text-(length:--text-body-sm) font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-surface-primary text-primary shadow-sm border border-border-subtle/60'
                : 'text-secondary hover:text-primary hover:bg-surface-primary/40'
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};

export default TripFilter;
