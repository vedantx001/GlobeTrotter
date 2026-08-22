import { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import Button from '../common/Button';
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
                  <select 
                    value={filters.category || 'All'} 
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full text-sm border border-border-default rounded-md px-3 py-2 bg-surface-elevated focus:outline-none focus:border-terracotta"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Price Level</label>
                  <select 
                    value={filters.priceLevel || 'All'} 
                    onChange={(e) => handleFilterChange('priceLevel', e.target.value)}
                    className="w-full text-sm border border-border-default rounded-md px-3 py-2 bg-surface-elevated focus:outline-none focus:border-terracotta"
                  >
                    <option value="All">Any Price</option>
                    <option value="$">$ (Budget)</option>
                    <option value="$$">$$ (Moderate)</option>
                    <option value="$$$">$$$ (Premium)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Minimum Rating</label>
                  <select 
                    value={filters.minRating || 'All'} 
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                    className="w-full text-sm border border-border-default rounded-md px-3 py-2 bg-surface-elevated focus:outline-none focus:border-terracotta"
                  >
                    <option value="All">Any Rating</option>
                    <option value="4.0">4.0 & Up</option>
                    <option value="4.5">4.5 & Up</option>
                    <option value="4.8">4.8 & Up</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Duration</label>
                  <select 
                    value={filters.duration || 'All'} 
                    onChange={(e) => handleFilterChange('duration', e.target.value)}
                    className="w-full text-sm border border-border-default rounded-md px-3 py-2 bg-surface-elevated focus:outline-none focus:border-terracotta"
                  >
                    <option value="All">Any Duration</option>
                    <option value="Under 2 hours">Under 2 hours</option>
                    <option value="2-4 hours">2 - 4 hours</option>
                    <option value="4+ hours">4+ hours</option>
                  </select>
                </div>
              </>
            )}

            {/* CITY FILTERS */}
            {mode === 'cities' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Region</label>
                  <select 
                    value={filters.region || 'All'} 
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    className="w-full text-sm border border-border-default rounded-md px-3 py-2 bg-surface-elevated focus:outline-none focus:border-terracotta"
                  >
                    <option value="All">All Regions</option>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Cost Index</label>
                  <select 
                    value={filters.costIndex || 'All'} 
                    onChange={(e) => handleFilterChange('costIndex', e.target.value)}
                    className="w-full text-sm border border-border-default rounded-md px-3 py-2 bg-surface-elevated focus:outline-none focus:border-terracotta"
                  >
                    <option value="All">Any Cost</option>
                    <option value="1">1 (Budget)</option>
                    <option value="2">2 (Moderate)</option>
                    <option value="3">3 (Expensive)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Popularity</label>
                  <select 
                    value={filters.popularity || 'All'} 
                    onChange={(e) => handleFilterChange('popularity', e.target.value)}
                    className="w-full text-sm border border-border-default rounded-md px-3 py-2 bg-surface-elevated focus:outline-none focus:border-terracotta"
                  >
                    <option value="All">Any Popularity</option>
                    <option value="High (90+)">High (90+)</option>
                    <option value="Medium (80-89)">Medium (80-89)</option>
                  </select>
                </div>
              </>
            )}

            {/* SHARED FILTERS */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Country</label>
              <select 
                value={filters.country || 'All'} 
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full text-sm border border-border-default rounded-md px-3 py-2 bg-surface-elevated focus:outline-none focus:border-terracotta"
              >
                <option value="All">All Countries</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
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
