import { useState, useEffect, useMemo } from 'react';
import { X, Search, MapPin, Globe, Filter } from 'lucide-react';
import Button from '../common/Button';
import { getTripSuggestions } from '../../api/trips_api';
import countriesData from '../../data/countries.json';

const CitySearchModal = ({ isOpen, onClose, onAdd, trip }) => {
  const [query, setQuery] = useState('');
  const [allCities, setAllCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Extract planned country from trip object or stops
  const plannedCountry = useMemo(() => {
    if (!trip) return '';
    
    // Check direct trip country fields
    if (trip.country) return trip.country;
    if (trip.destination_country) return trip.destination_country;
    if (trip.countryId) {
      const matched = countriesData.find(c => c.id === trip.countryId);
      if (matched) return matched.name;
    }

    // Check existing stops for countries
    if (trip.stops && trip.stops.length > 0) {
      for (const stop of trip.stops) {
        const countryName = stop.city?.country || stop.country;
        if (countryName) return countryName;
      }
    }

    // Fallback search in title for common country names
    if (trip.title) {
      for (const c of countriesData) {
        if (trip.title.toLowerCase().includes(c.name.toLowerCase())) {
          return c.name;
        }
      }
    }

    return '';
  }, [trip]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setQuery('');
      setAllCities([]);
      setSelectedCity(null);
      setSelectedCountryFilter('');
      setStartDate('');
      setEndDate('');
      setNotes('');
      setError('');
    } else {
      // Load initial suggestions from JSON dataset
      fetchCities();
      if (plannedCountry) {
        setSelectedCountryFilter(plannedCountry);
      }
    }
  }, [isOpen, plannedCountry]);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const data = await getTripSuggestions();
      const results = data?.data || data?.cities || data || [];
      setAllCities(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique list of available countries from loaded cities
  const availableCountries = useMemo(() => {
    const set = new Set();
    allCities.forEach(c => {
      if (c.country) set.add(c.country);
    });
    return Array.from(set).sort();
  }, [allCities]);

  // Filter cities based on selected country filter and search query
  const filteredCities = useMemo(() => {
    let result = allCities;

    // Filter by country if selected
    if (selectedCountryFilter) {
      result = result.filter(c => 
        c.country?.toLowerCase() === selectedCountryFilter.toLowerCase() ||
        c.countryId?.toLowerCase() === selectedCountryFilter.toLowerCase()
      );
    }

    // Filter by search query
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(c => 
        (c.name || c.city || '').toLowerCase().includes(q) ||
        (c.country || '').toLowerCase().includes(q) ||
        (c.region || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [allCities, selectedCountryFilter, query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCity) {
      setError('Please select a destination.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please select start and end dates.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        city_id: selectedCity.id || selectedCity._id || 'unknown',
        cityName: selectedCity.name || selectedCity.city,
        start_date: startDate,
        end_date: endDate,
        notes: notes
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add stop');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="absolute inset-0 bg-obsidian/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-surface-primary border border-border-subtle rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] z-10 font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border-subtle bg-surface-primary">
          <div>
            <span className="text-[10px] font-semibold text-terracotta uppercase tracking-wider block font-sans">
              NEW DESTINATION
            </span>
            <h2 className="font-display font-normal text-2xl sm:text-3xl text-primary leading-tight">
              Add a Stop to Your Journey
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-stone/60 hover:text-primary hover:bg-surface-secondary rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          
          {/* Step 1: Select City */}
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-primary uppercase tracking-wider">
                1. Select Destination
              </label>
              {plannedCountry && !selectedCountryFilter && (
                <span className="text-[11px] text-terracotta font-medium">
                  Trip Country: {plannedCountry}
                </span>
              )}
            </div>
            
            {!selectedCity ? (
              <div className="space-y-3 font-sans">
                {/* Search & Country Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  
                  {/* Search Input */}
                  <div className="relative sm:col-span-3">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone/70" size={16} />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search cities..."
                      className="w-full pl-10 pr-4 py-2 rounded-full border border-border-subtle bg-surface-primary text-xs sm:text-sm text-primary placeholder:text-stone/50 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all shadow-2xs font-sans"
                    />
                  </div>

                  {/* Country Filter Select Dropdown */}
                  <div className="relative sm:col-span-2">
                    <select
                      value={selectedCountryFilter}
                      onChange={(e) => setSelectedCountryFilter(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 rounded-full border border-border-subtle bg-surface-primary text-xs font-medium text-primary focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all shadow-2xs font-sans appearance-none cursor-pointer"
                    >
                      <option value="">All Countries</option>
                      {availableCountries.map(country => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <Filter size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone/60 pointer-events-none" />
                  </div>

                </div>
                
                {/* City Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {loading ? (
                    <div className="col-span-full text-center text-secondary py-6 text-xs font-sans">Loading destinations...</div>
                  ) : filteredCities.length > 0 ? (
                    filteredCities.map(city => (
                      <button
                        type="button"
                        key={city.id || city.name}
                        onClick={() => { setSelectedCity(city); setError(''); }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border-subtle hover:border-border-default bg-surface-primary hover:bg-surface-secondary/60 transition-all text-left group cursor-pointer shadow-2xs"
                      >
                        <div className="w-9 h-9 rounded-full bg-surface-secondary flex items-center justify-center shrink-0 overflow-hidden border border-border-subtle">
                          {city.image ? (
                            <img src={city.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <MapPin size={15} className="text-terracotta" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-semibold text-primary group-hover:text-terracotta transition-colors truncate font-sans">
                            {city.name || city.city}
                          </p>
                          <p className="text-[11px] text-secondary truncate font-sans">{city.country}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-secondary py-6 text-xs font-sans">
                      No cities found {selectedCountryFilter ? `in ${selectedCountryFilter}` : ''}.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-terracotta/40 bg-terracotta/5 font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-surface-primary flex items-center justify-center overflow-hidden border border-border-subtle shrink-0">
                    {selectedCity.image ? (
                       <img src={selectedCity.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <MapPin size={15} className="text-terracotta" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary font-sans">{selectedCity.name || selectedCity.city}</p>
                    <p className="text-xs text-secondary font-sans">{selectedCity.country}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedCity(null)}
                  className="text-xs font-medium text-terracotta hover:underline cursor-pointer font-sans"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Dates & Notes */}
          {selectedCity && (
            <div className="space-y-4 pt-2 border-t border-border-subtle/50 font-sans">
              <div>
                <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  2. Select Stay Dates
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Start Date Dropdown Calendar */}
                  <div>
                    <label className="block text-[11px] font-medium text-secondary uppercase tracking-wider mb-1">
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        min={trip?.startDate}
                        max={trip?.endDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          if (error) setError('');
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-surface-primary text-xs sm:text-sm font-medium text-primary focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all shadow-2xs font-sans cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* End Date Dropdown Calendar */}
                  <div>
                    <label className="block text-[11px] font-medium text-secondary uppercase tracking-wider mb-1">
                      End Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        min={startDate || trip?.startDate}
                        max={trip?.endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          if (error) setError('');
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-surface-primary text-xs sm:text-sm font-medium text-primary focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all shadow-2xs font-sans cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
                  3. Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., Arriving by train at 3 PM..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-surface-primary text-xs sm:text-sm text-primary placeholder:text-stone/50 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all resize-y shadow-2xs font-sans"
                />
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-danger-soft text-danger text-xs rounded-xl font-sans">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-border-subtle bg-surface-primary flex justify-end gap-2.5 font-sans">
          <Button variant="secondary" onClick={onClose} className="!w-auto px-4 py-2 text-xs font-medium cursor-pointer font-sans">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            loading={isSubmitting} 
            disabled={!selectedCity || !startDate || !endDate}
            className="!w-auto px-5 py-2 text-xs font-medium cursor-pointer font-sans"
          >
            Add Destination
          </Button>
        </div>

      </div>
    </div>
  );
};

export default CitySearchModal;
