const TripFilter = ({ currentFilter, onFilterChange }) => {
  const filters = ['All', 'Upcoming', 'Completed'];

  return (
    <div className="flex items-center gap-2 p-1 bg-surface-muted border border-border-subtle rounded-full w-fit">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-1.5 rounded-full text-(length:--text-body-sm) font-medium transition-all ${
            currentFilter === filter
              ? 'bg-white text-primary shadow-sm'
              : 'text-secondary hover:text-primary hover:bg-white/50'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default TripFilter;
