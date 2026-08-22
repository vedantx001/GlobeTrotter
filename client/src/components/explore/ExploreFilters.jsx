import { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import Button from '../common/Button';
import Select from '../common/Select';
import { getAvailableCountries, getAvailableRegions, getAvailableCategories } from '../../utils/explore_utils';

const ExploreFilters = ({ mode, filters, setFilters, activeCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setFilters({});
    setIsOpen(false);
  };

  const countries = getAvailableCountries();
  const regions = getAvailableRegions();
  const categories = getAvailableCategories();

  return (
    <div className="relative shrink-0" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-lg)] border transition-colors text-(length:--text-body-sm) font-medium ${
          activeCount > 0 
            ? 'bg-terracotta text-white border-terracotta' 
            : 'bg-surface-elevated border-border-default text-secondary hover:text-primary hover:border-border-strong'
        }`}
      >
        <Filter size={16} />
        <span>Filters {activeCount > 0 && `(${activeCount})`}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-surface-primary border border-border-subtle rounded-[var(--radius-xl)] shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-border-subtle flex items-center justify-between">
            <h3 className="font-medium text-primary">Filters</h3>
            <button onClick={() => setIsOpen(false)} className="text-secondary hover:text-primary p-1">
              <X size={16} />
            </button>
          </div>
          
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            
            {/* ACTIVITY FILTERS */}
            {mode === 'activities' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Category</label>
                  <Select 
                    value={filters.category || 'All'} 
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    options={[{ value: 'All', label: 'All Categories' }, ...categories.map(c => ({ value: c, label: c }))]}
                    size="sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Price Level</label>
                  <Select 
                    value={filters.priceLevel || 'All'} 
                    onChange={(e) => handleFilterChange('priceLevel', e.target.value)}
                    options={[
                      { value: 'All', label: 'Any Price' },
                      { value: '$', label: '$ (Budget)' },
                      { value: '$$', label: '$$ (Moderate)' },
                      { value: '$$$', label: '$$$ (Premium)' }
                    ]}
                    size="sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Minimum Rating</label>
                  <Select 
                    value={filters.minRating || 'All'} 
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                    options={[
                      { value: 'All', label: 'Any Rating' },
                      { value: '4.0', label: '4.0 & Up' },
                      { value: '4.5', label: '4.5 & Up' },
                      { value: '4.8', label: '4.8 & Up' }
                    ]}
                    size="sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Duration</label>
                  <Select 
                    value={filters.duration || 'All'} 
                    onChange={(e) => handleFilterChange('duration', e.target.value)}
                    options={[
                      { value: 'All', label: 'Any Duration' },
                      { value: 'Under 2 hours', label: 'Under 2 hours' },
                      { value: '2-4 hours', label: '2 - 4 hours' },
                      { value: '4+ hours', label: '4+ hours' }
                    ]}
                    size="sm"
                  />
                </div>
              </>
            )}

            {/* CITY FILTERS */}
            {mode === 'cities' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Region</label>
                  <Select 
                    value={filters.region || 'All'} 
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    options={[{ value: 'All', label: 'All Regions' }, ...regions.map(r => ({ value: r, label: r }))]}
                    size="sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Cost Index</label>
                  <Select 
                    value={filters.costIndex || 'All'} 
                    onChange={(e) => handleFilterChange('costIndex', e.target.value)}
                    options={[
                      { value: 'All', label: 'Any Cost' },
                      { value: '1', label: '1 (Budget)' },
                      { value: '2', label: '2 (Moderate)' },
                      { value: '3', label: '3 (Expensive)' }
                    ]}
                    size="sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Popularity</label>
                  <Select 
                    value={filters.popularity || 'All'} 
                    onChange={(e) => handleFilterChange('popularity', e.target.value)}
                    options={[
                      { value: 'All', label: 'Any Popularity' },
                      { value: 'High (90+)', label: 'High (90+)' },
                      { value: 'Medium (80-89)', label: 'Medium (80-89)' }
                    ]}
                    size="sm"
                  />
                </div>
              </>
            )}

            {/* SHARED FILTERS */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Country</label>
              <Select 
                value={filters.country || 'All'} 
                onChange={(e) => handleFilterChange('country', e.target.value)}
                options={[{ value: 'All', label: 'All Countries' }, ...countries.map(c => ({ value: c, label: c }))]}
                size="sm"
              />
            </div>
            
          </div>
          
          <div className="p-4 border-t border-border-subtle bg-surface-muted flex gap-3">
            <Button variant="secondary" onClick={handleClear} className="w-1/2 py-2">
              Clear
            </Button>
            <Button onClick={() => setIsOpen(false)} className="w-1/2 py-2">
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreFilters;
