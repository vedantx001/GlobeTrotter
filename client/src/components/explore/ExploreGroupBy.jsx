const ExploreGroupBy = ({ mode, groupMode, setGroupMode }) => {
  if (mode !== 'activities') return null;

  return (
    <div className="flex items-center gap-2 shrink-0">
      <label className="text-[10px] sm:text-(length:--text-caption) text-secondary font-bold uppercase tracking-wider whitespace-nowrap">Group By</label>
      <select 
        value={groupMode} 
        onChange={(e) => setGroupMode(e.target.value)}
        className="text-(length:--text-body-sm) border border-border-default rounded-[var(--radius-md)] px-3 py-1.5 bg-surface-elevated focus:outline-none focus:border-terracotta shadow-sm min-w-[120px]"
      >
        <option value="None">None</option>
        <option value="Country">Country</option>
        <option value="City">City</option>
        <option value="Category">Category</option>
        <option value="Price">Price</option>
      </select>
    </div>
  );
};

export default ExploreGroupBy;
