import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { getTrips } from '../../api/trips_api';
import { createCommunityExperience } from '../../api/community_api';
import { AlertCircle } from 'lucide-react';

const ShareExperienceModal = ({ isOpen, onClose, onSuccess }) => {
  const [type, setType] = useState('Trip');
  const [trips, setTrips] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setType('Trip');
      setSelectedItem('');
      setTitle('');
      setDescription('');
      setError(null);
      setValidationError('');
      loadTrips();
    }
  }, [isOpen]);

  const loadTrips = async () => {
    try {
      setLoadingTrips(true);
      const data = await getTrips();
      setTrips(data || []);
    } catch (err) {
      console.error('Failed to load trips for modal:', err);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    if (!selectedItem) {
      setValidationError('Please select a trip to share.');
      return;
    }
    if (!title.trim()) {
      setValidationError('Please provide a title for your experience.');
      return;
    }
    if (!description.trim()) {
      setValidationError('Please share some details about your experience.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        type,
        referenceId: selectedItem,
        title,
        description
      };
      
      await createCommunityExperience(payload);
      onSuccess();
    } catch (err) {
      console.error('Failed to share experience:', err);
      // Since endpoint doesn't exist, this will trigger.
      setError('The sharing service is temporarily unavailable. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Share your experience"
      maxWidth="max-w-lg"
    >
      <div className="mb-6">
        <p className="text-secondary text-(length:--text-body-sm)">
          Tell the community about a trip or activity you enjoyed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Type Selection */}
        <div>
          <label className="block text-[10px] sm:text-(length:--text-caption) font-bold text-primary mb-2 uppercase tracking-wider">
            Experience Type
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-(length:--text-body-sm)">
              <input 
                type="radio" 
                name="type" 
                value="Trip" 
                checked={type === 'Trip'} 
                onChange={(e) => { setType(e.target.value); setSelectedItem(''); }}
                className="accent-terracotta"
              />
              Trip Journey
            </label>
            <label className="flex items-center gap-2 cursor-not-allowed text-(length:--text-body-sm) opacity-50" title="Coming Soon">
              <input 
                type="radio" 
                name="type" 
                value="Activity" 
                checked={type === 'Activity'} 
                onChange={() => {}}
                className="accent-terracotta"
                disabled
              />
              <span className="line-through">Activity</span>
            </label>
          </div>
        </div>

        {/* Selection */}
        <div>
          <Select
            label={`Select ${type}`}
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            disabled={loadingTrips || trips.length === 0}
            placeholder={loadingTrips ? 'Loading...' : `Choose a ${type.toLowerCase()}...`}
            options={trips.map(trip => ({
              value: trip.id || trip._id,
              label: trip.title || trip.destination || 'Untitled Trip'
            }))}
          />
          {trips.length === 0 && !loadingTrips && type === 'Trip' && (
            <p className="text-xs text-secondary mt-2">You don't have any trips yet. Create one first!</p>
          )}
        </div>

        {/* Title */}
        <Input 
          label="Experience Title"
          placeholder="e.g. A perfect autumn weekend in Paris"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <div>
          <label className="block text-[10px] sm:text-(length:--text-caption) font-bold text-primary mb-2 uppercase tracking-wider">
            Experience Details
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell the community what made this trip special..."
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-border-default bg-surface-elevated focus:outline-none focus:border-terracotta transition-colors text-(length:--text-body-sm) min-h-[120px] resize-y"
            required
          />
        </div>

        {/* Errors */}
        {validationError && (
          <div className="flex items-center gap-2 text-danger text-sm bg-danger-soft p-3 rounded-lg border border-danger/20">
            <AlertCircle size={16} className="shrink-0" />
            <p>{validationError}</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-danger text-sm bg-danger-soft p-3 rounded-lg border border-danger/20">
            <AlertCircle size={16} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-border-subtle mt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish Experience'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ShareExperienceModal;
