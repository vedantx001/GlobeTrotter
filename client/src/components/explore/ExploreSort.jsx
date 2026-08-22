const ExploreSort = ({ mode, sortMode, setSortMode }) => {
  if (mode !== 'activities') return null;

  return (
    <div className="flex items-center gap-2 shrink-0">
      <label className="text-[10px] sm:text-(length:--text-caption) text-secondary font-bold uppercase tracking-wider whitespace-nowrap">Sort By</label>
      <select 
        value={sortMode} 
        onChange={(e) => setSortMode(e.target.value)}
        className="text-(length:--text-body-sm) border border-border-default rounded-[var(--radius-md)] px-3 py-1.5 bg-surface-elevated focus:outline-none focus:border-terracotta shadow-sm min-w-[140px]"
      >
        <option value="Popular">Popular</option>
        <option value="Highest Rated">Highest Rated</option>
        <option value="Price: Low to High">Price: Low to High</option>
        <option value="Price: High to Low">Price: High to Low</option>
      </select>
    </div>
  );
};

export default ExploreSort;
