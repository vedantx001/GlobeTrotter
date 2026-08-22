import Select from '../common/Select';

const ExploreSort = ({ mode, sortMode, setSortMode }) => {
  if (mode !== 'activities') return null;

  const sortOptions = [
    { value: 'Popular', label: 'Popular' },
    { value: 'Highest Rated', label: 'Highest Rated' },
    { value: 'Price: Low to High', label: 'Price: Low to High' },
    { value: 'Price: High to Low', label: 'Price: High to Low' },
  ];

  return (
    <div className="flex items-center gap-2 shrink-0">
      <label className="text-[10px] sm:text-(length:--text-caption) text-secondary font-bold uppercase tracking-wider whitespace-nowrap">Sort By</label>
      <Select 
        value={sortMode} 
        onChange={(e) => setSortMode(e.target.value)}
        options={sortOptions}
        size="sm"
        className="min-w-[160px]"
      />
    </div>
  );
};

export default ExploreSort;

