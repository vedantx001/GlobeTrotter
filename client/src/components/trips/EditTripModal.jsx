import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const EditTripModal = ({ isOpen, trip, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    total_budget: '',
    coverImage: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Helper to format date string into YYYY-MM-DD for standard date input
  const formatDateForInput = (dateVal) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    if (trip && isOpen) {
      setFormData({
        title: trip.title || '',
        startDate: formatDateForInput(trip.startDate),
        endDate: formatDateForInput(trip.endDate || trip.startDate),
        total_budget: trip.total_budget ?? trip.budget ?? '',
        coverImage: trip.coverImage || trip.image || '',
        description: trip.description || ''
      });
      setErrors({});
      setApiError(null);
    }
  }, [trip, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Trip name is required.';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required.';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required.';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date.';
    }

    if (
      formData.total_budget === '' || 
      formData.total_budget === null || 
      isNaN(formData.total_budget) || 
      Number(formData.total_budget) < 0
    ) {
      newErrors.total_budget = 'Budget must be a valid non-negative number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    try {
      setIsSaving(true);
      const payload = {
        ...(trip || {}),
        id: trip?.id || trip?._id,
        title: formData.title.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        total_budget: Number(formData.total_budget),
        coverImage: formData.coverImage.trim() || null,
        description: formData.description.trim() || ''
      };

      await onSave(payload);
    } catch (err) {
      console.error('Error saving trip changes:', err);
      setApiError('Unable to save trip changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !trip) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Edit Trip" 
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-xs text-secondary mb-1 -mt-2">
          Update the details of your trip itinerary.
        </p>

        {apiError && (
          <div className="p-3 rounded-md bg-danger-soft/60 border border-danger/30 text-danger text-xs">
            {apiError}
          </div>
        )}

        {/* Trip Name */}
        <Input
          label="Trip Name"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Autumn in Europe"
          required
          error={errors.title}
        />

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
            error={errors.startDate}
          />

          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
            error={errors.endDate}
          />
        </div>

        {/* Budget */}
        <Input
          label="Total Budget ($)"
          name="total_budget"
          type="number"
          min="0"
          step="1"
          value={formData.total_budget}
          onChange={handleChange}
          placeholder="e.g. 5200"
          required
          error={errors.total_budget}
        />

        {/* Cover Image URL */}
        <div className="flex flex-col gap-1.5 w-full">
          <Input
            label="Cover Image URL"
            name="coverImage"
            type="url"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            helperText="Provide an image URL to replace the cover photo."
            error={errors.coverImage}
          />

          {formData.coverImage.trim() && (
            <div className="mt-1 relative h-24 w-full rounded-md overflow-hidden border border-border-subtle bg-surface-muted">
              <img 
                src={formData.coverImage} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="description" className="text-(length:--text-body-sm) text-secondary font-medium">
            Description <span className="text-stone font-normal text-xs">(Optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Add notes about your trip goals, themes, or highlights..."
            className="w-full px-3.5 py-2.5 rounded-md border text-(length:--text-body) bg-surface-elevated transition-colors border-border-default hover:border-border-strong focus:outline-none focus:border-terracotta text-xs"
          />
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
          <Button 
            variant="secondary" 
            type="button" 
            onClick={onClose}
            disabled={isSaving}
            className="!w-auto px-5 py-2 text-xs font-medium cursor-pointer"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={isSaving}
            disabled={isSaving}
            className="!w-auto px-6 py-2 text-xs font-medium cursor-pointer"
          >
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTripModal;
