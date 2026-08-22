import { useState, useMemo } from 'react';
import { Compass, Map } from 'lucide-react';
import ExploreSearchBar from '../../components/explore/ExploreSearchBar';
import ExploreFilters from '../../components/explore/ExploreFilters';
import ExploreSort from '../../components/explore/ExploreSort';
import ExploreGroupBy from '../../components/explore/ExploreGroupBy';
import ActivityResultCard from '../../components/explore/ActivityResultCard';
import CityResultCard from '../../components/explore/CityResultCard';
import ActivityDetailModal from '../../components/explore/ActivityDetailModal';
import CityDetailModal from '../../components/explore/CityDetailModal';
import Button from '../../components/common/Button';
import { getActivitiesPipeline, getCitiesPipeline } from '../../utils/explore_utils';

const ExplorePage = () => {
  // Global View State
  const [mode, setMode] = useState('activities'); // 'activities' or 'cities'

  // Pipeline State
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortMode, setSortMode] = useState('Popular');
  const [groupMode, setGroupMode] = useState('None');

  // Detail Modal State
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Compute Results
  const pipelineResult = useMemo(() => {
    if (mode === 'activities') {
      return getActivitiesPipeline(query, filters, sortMode, groupMode);
    } else {
      return getCitiesPipeline(query, filters, sortMode);
    }
  }, [mode, query, filters, sortMode, groupMode]);

  // Handlers
  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    // Reset pipeline state on mode switch to prevent invalid cross-contamination
    setQuery('');
    setFilters({});
    setSortMode('Popular');
    setGroupMode('None');
  };

  const activeFilterCount = Object.keys(filters).filter(k => filters[k] !== 'All' && filters[k] !== '').length;

  return (
    <div className="w-full max-w-6xl mx-auto pb-24">
      {/* Header Section */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="font-display text-(length:--text-heading-xl) text-primary mb-3">Explore</h1>
        <p className="text-(length:--text-body) text-secondary max-w-2xl">
          Find places worth building your journey around. Discover world-class activities and iconic destinations.
        </p>
      </div>

      {/* Mode Toggle & Control Row */}
      <div className="bg-surface-primary rounded-[var(--radius-xl)] border border-border-default shadow-[var(--shadow-soft)] p-4 sm:p-6 mb-8 flex flex-col gap-6">
        
        {/* Mode Toggle */}
        <div className="flex bg-surface-muted p-1 rounded-[var(--radius-lg)] self-start border border-border-subtle">
          <button
            onClick={() => handleModeSwitch('activities')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-bold transition-all ${
              mode === 'activities' 
                ? 'bg-surface-primary text-primary shadow-sm' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            <Compass size={16} /> Activities
          </button>
          <button
            onClick={() => handleModeSwitch('cities')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-bold transition-all ${
              mode === 'cities' 
                ? 'bg-surface-primary text-primary shadow-sm' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            <Map size={16} /> Destinations
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full">
          <div className="flex-1">
            <ExploreSearchBar 
              query={query} 
              onQueryChange={setQuery} 
              placeholder={mode === 'activities' ? "Search for paragliding, diving, Paris..." : "Search for Rome, Japan, beach..."}
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
            <ExploreFilters 
              mode={mode} 
              filters={filters} 
              setFilters={setFilters} 
              activeCount={activeFilterCount}
            />
            {mode === 'activities' && (
              <>
                <ExploreSort mode={mode} sortMode={sortMode} setSortMode={setSortMode} />
                <ExploreGroupBy mode={mode} groupMode={groupMode} setGroupMode={setGroupMode} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary mb-1">
          {mode === 'activities' ? 'Activity Places' : 'Destinations'}
        </h2>
        <p className="text-sm text-secondary">
          {pipelineResult.isGrouped ? 'Grouped view' : `${pipelineResult.results?.length || 0} ${pipelineResult.results?.length === 1 ? 'result' : 'results'} found`}
        </p>
      </div>

      {/* Empty State */}
      {(!pipelineResult.isGrouped && pipelineResult.results.length === 0) && (
        <div className="bg-surface-primary border border-border-default border-dashed rounded-[var(--radius-2xl)] py-20 px-6 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center text-stone mb-4">
            <Compass size={28} />
          </div>
          <h3 className="text-lg font-bold text-primary mb-2">No places found</h3>
          <p className="text-secondary max-w-sm mb-6">
            We couldn't find any {mode} matching your current search and filters. Try adjusting your criteria.
          </p>
          {(activeFilterCount > 0 || query !== '') && (
            <Button 
              variant="secondary" 
              onClick={() => {
                setQuery('');
                setFilters({});
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {/* Render Ungrouped Results */}
      {!pipelineResult.isGrouped && pipelineResult.results?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mode === 'activities' ? (
            pipelineResult.results.map(place => (
              <ActivityResultCard 
                key={place.id} 
                place={place} 
                onClick={setSelectedActivity} 
              />
            ))
          ) : (
            pipelineResult.results.map(city => (
              <CityResultCard 
                key={city.id} 
                city={city} 
                onClick={setSelectedCity} 
              />
            ))
          )}
        </div>
      )}

      {/* Render Grouped Results */}
      {pipelineResult.isGrouped && (
        <div className="space-y-12">
          {pipelineResult.sortedGroupKeys.map(groupKey => {
            const items = pipelineResult.groups[groupKey];
            if (!items || items.length === 0) return null;
            
            return (
              <div key={groupKey}>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-xl font-display text-primary">{groupKey}</h3>
                  <div className="h-px bg-border-subtle flex-1"></div>
                  <span className="text-sm font-medium text-secondary bg-surface-muted px-2 py-0.5 rounded">
                    {items.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map(place => (
                    <ActivityResultCard 
                      key={place.id} 
                      place={place} 
                      onClick={setSelectedActivity} 
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ActivityDetailModal 
        isOpen={!!selectedActivity} 
        onClose={() => setSelectedActivity(null)} 
        place={selectedActivity} 
      />
      
      <CityDetailModal 
        isOpen={!!selectedCity} 
        onClose={() => setSelectedCity(null)} 
        city={selectedCity} 
      />
      
    </div>
  );
};

export default ExplorePage;
