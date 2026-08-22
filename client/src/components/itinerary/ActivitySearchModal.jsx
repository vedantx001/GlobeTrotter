import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Select from '../common/Select';
import { searchActivities } from '../../api/trips_api';

const ActivitySearchModal = ({ isOpen, onClose, onAdd, stop }) => {
  const [query, setQuery] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Selection details
  const [timeSlot, setTimeSlot] = useState('Morning');
  const [scheduledDate, setScheduledDate] = useState(stop?.start_date || '');
  const [customCost, setCustomCost] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActivities([]);
      setSelectedActivity(null);
      setTimeSlot('Morning');
      setScheduledDate(stop?.start_date || '');
      setCustomCost('');
      setError('');
    } else {
      handleSearch('');
    }
  }, [isOpen, stop]);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const data = await searchActivities({ q: searchQuery });
      // searchActivities already filters by q (both backend and local fallback)
      // Just ensure we always set an array
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedActivity) {
      setError('Please select an activity.');
      return;
    }
    if (!scheduledDate) {
      setError('Please select a scheduled date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        activity_id: selectedActivity.id,
        title: selectedActivity.title,
        category: selectedActivity.category,
        scheduled_date: scheduledDate,
        time_slot: timeSlot,
        custom_cost: customCost ? Number(customCost) : selectedActivity.defaultCost
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-obsidian/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-ivory rounded-[var(--radius-3xl)] shadow-[var(--shadow-modal)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-warm-white">
          <h2 className="font-display text-(length:--text-heading-sm) text-primary">Add Activity</h2>
          <button onClick={onClose} className="p-2 text-secondary hover:text-primary hover:bg-surface-muted rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {!selectedActivity ? (
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
                  placeholder="Search activities..."
                  className="w-full pl-10 pr-4 py-3 rounded-[var(--radius-md)] border border-border-default bg-surface-elevated focus:outline-none focus:border-terracotta transition-colors"
                />
              </div>
              
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {loading ? (
                  <div className="text-center text-secondary py-4 text-sm">Searching...</div>
                ) : activities.length > 0 ? (
                  activities.map(act => (
                    <button
                      key={act.id}
                      onClick={() => { setSelectedActivity(act); setError(''); }}
                      className="flex flex-col w-full p-4 rounded-[var(--radius-lg)] border border-border-subtle hover:border-border-strong bg-warm-white hover:bg-surface-muted transition-all text-left"
                    >
                      <div className="flex justify-between items-start w-full mb-1">
                        <span className="text-(length:--text-body-sm) font-medium text-primary">{act.title}</span>
                        <span className="text-(length:--text-caption) font-medium text-stone">€{act.defaultCost}</span>
                      </div>
                      <span className="text-xs text-secondary">{act.category}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-center text-secondary py-4 text-sm">No activities found.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center justify-between p-4 rounded-[var(--radius-lg)] border border-terracotta/30 bg-terracotta/5">
                <div>
                  <p className="text-(length:--text-body-sm) font-medium text-primary">{selectedActivity.title}</p>
                  <p className="text-xs text-secondary">{selectedActivity.category}</p>
                </div>
                <button 
                  onClick={() => setSelectedActivity(null)}
                  className="text-xs font-medium text-terracotta hover:underline"
                >
                  Change
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Scheduled Date"
                  name="scheduledDate"
                  type="date"
                  value={scheduledDate}
                  min={stop?.start_date}
                  max={stop?.end_date}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
                
                <Select
                  label="Time Slot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  options={[
                    { value: 'Morning', label: 'Morning' },
                    { value: 'Afternoon', label: 'Afternoon' },
                    { value: 'Evening', label: 'Evening' }
                  ]}
                  required
                />

                <Input
                  label="Custom Cost (Optional)"
                  name="customCost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={`Default: €${selectedActivity.defaultCost}`}
                  value={customCost}
                  onChange={(e) => setCustomCost(e.target.value)}
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
          <Button onClick={handleSubmit} loading={isSubmitting} disabled={!selectedActivity || !scheduledDate}>
            Add Activity
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ActivitySearchModal;
