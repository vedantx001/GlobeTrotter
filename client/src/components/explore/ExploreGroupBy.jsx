import Select from '../common/Select';

const ExploreGroupBy = ({ mode, groupMode, setGroupMode }) => {
  if (mode !== 'activities') return null;

  const groupOptions = [
    { value: 'None', label: 'None' },
    { value: 'Country', label: 'Country' },
    { value: 'City', label: 'City' },
    { value: 'Category', label: 'Category' },
    { value: 'Price', label: 'Price' },
  ];

  return (
    <div className="flex items-center gap-2 shrink-0">
      <label className="text-[10px] sm:text-(length:--text-caption) text-secondary font-bold uppercase tracking-wider whitespace-nowrap">Group By</label>
      <Select 
        value={groupMode} 
        onChange={(e) => setGroupMode(e.target.value)}
        options={groupOptions}
        size="sm"
        className="min-w-[140px]"
      />
    </div>
  );
};

export default ExploreGroupBy;

