import { useState, useEffect } from 'react';
import { X, Search, MapPin } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import DateRangePicker from '../common/DateRangePicker';
import { getTripSuggestions } from '../../api/trips_api';

const CitySearchModal = ({ isOpen, onClose, onAdd, trip }) => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setQuery('');
      setCities([]);
      setSelectedCity(null);
      setStartDate('');
      setEndDate('');
      setNotes('');
      setError('');
    } else {
      // Load initial suggestions
      handleSearch('');
    }
  }, [isOpen]);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      // In a real app, pass searchQuery. Here we just use the mock from getTripSuggestions
      const data = await getTripSuggestions();
      // Filter mock data locally if there's a query
      let results = data;
      if (searchQuery) {
        results = data.filter(c => 
          (c.name || c.city || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setCities(results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    if (error) setError('');
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-obsidian/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-ivory rounded-[var(--radius-3xl)] shadow-[var(--shadow-modal)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-warm-white">
          <h2 className="font-display text-(length:--text-heading-sm) text-primary">Add a Destination</h2>
          <button onClick={onClose} className="p-2 text-secondary hover:text-primary hover:bg-surface-muted rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          
          {/* Step 1: Select City */}
          <div>
            <h3 className="text-(length:--text-body-sm) font-medium text-primary mb-3">1. Where are you going?</h3>
            
            {!selectedCity ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Search cities..."
                    className="w-full pl-10 pr-4 py-3 rounded-[var(--radius-md)] border border-border-default bg-surface-elevated focus:outline-none focus:border-terracotta transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="col-span-full text-center text-secondary py-4 text-sm">Searching...</div>
                  ) : cities.length > 0 ? (
                    cities.map(city => (
                      <button
                        key={city.id || city.name}
                        onClick={() => { setSelectedCity(city); setError(''); }}
                        className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] border border-border-subtle hover:border-border-strong bg-warm-white hover:bg-surface-muted transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center shrink-0 overflow-hidden">
                          {city.image ? (
                            <img src={city.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <MapPin size={16} className="text-secondary" />
                          )}
                        </div>
                        <div>
                          <p className="text-(length:--text-body-sm) font-medium text-primary line-clamp-1">{city.name || city.city}</p>
                          <p className="text-xs text-secondary line-clamp-1">{city.country}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-secondary py-4 text-sm">No cities found.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-[var(--radius-lg)] border border-terracotta/30 bg-terracotta/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center overflow-hidden">
                    {selectedCity.image ? (
                       <img src={selectedCity.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <MapPin size={16} className="text-terracotta" />
                    )}
                  </div>
                  <div>
                    <p className="text-(length:--text-body-sm) font-medium text-primary">{selectedCity.name || selectedCity.city}</p>
                    <p className="text-xs text-secondary">{selectedCity.country}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCity(null)}
                  className="text-xs font-medium text-terracotta hover:underline"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Details */}
          {selectedCity && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h3 className="text-(length:--text-body-sm) font-medium text-primary mb-3">2. When will you be there?</h3>
                <DateRangePicker 
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateChange}
                  minDate={trip?.startDate}
                  maxDate={trip?.endDate}
                />
              </div>

              <div>
                <h3 className="text-(length:--text-body-sm) font-medium text-primary mb-3">3. Any notes? (Optional)</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., Arriving by train at 3 PM..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] border border-border-default bg-surface-elevated focus:outline-none focus:border-terracotta transition-colors resize-y text-(length:--text-body-sm)"
                />
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-danger-soft text-danger text-sm rounded-[var(--radius-md)]">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-subtle bg-warm-white flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting} disabled={!selectedCity || !startDate || !endDate}>
            Add Destination
          </Button>
        </div>

      </div>
    </div>
  );
};

export default CitySearchModal;
