import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import DateRangePicker from '../common/DateRangePicker';
import Button from '../common/Button';
import { createTrip } from '../../api/trips_api';
import { ImagePlus } from 'lucide-react';

const TripForm = ({ presetDestination }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    coverImage: '',
    budget: ''
  });

  const [localImagePreview, setLocalImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update title if preset destination is passed and title is currently empty
  useEffect(() => {
    if (presetDestination && !formData.title) {
      setFormData(prev => ({ ...prev, title: `Trip to ${presetDestination}` }));
    }
  }, [presetDestination, formData.title]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Trip name is required';
    else if (formData.title.length < 3) newErrors.title = 'Name must be at least 3 characters';

    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    if (!formData.budget) newErrors.budget = 'Budget is required';
    else if (isNaN(formData.budget) || Number(formData.budget) < 0) {
      newErrors.budget = 'Budget must be a positive number';
    }

    if (formData.coverImage && !localImagePreview) {
      try {
        new URL(formData.coverImage);
      } catch (e) {
        newErrors.coverImage = 'Must be a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      // Auto-adjust end date minimum if start date changes
      if (name === 'startDate' && next.endDate && new Date(next.endDate) < new Date(value)) {
        next.endDate = value;
      }
      return next;
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalImagePreview(url);
      setFormData(prev => ({ ...prev, coverImage: '' })); // Clear URL if local selected
      if (errors.coverImage) setErrors(prev => ({ ...prev, coverImage: undefined }));
    }
  };

  const handleDateChange = (start, end) => {
    setFormData(prev => ({ ...prev, startDate: start, endDate: end }));
    if (errors.startDate) setErrors(prev => ({ ...prev, startDate: undefined }));
    if (errors.endDate) setErrors(prev => ({ ...prev, endDate: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        total_budget: Number(formData.budget),
        cover_image: localImagePreview ? 'local-file-preview' : formData.coverImage
      };

      const response = await createTrip(payload);
      const newTripId = response.data?.id || response.id || response._id || 'new';
      
      navigate(`/builder/${newTripId}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to create this trip right now.';
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCover = localImagePreview || formData.coverImage;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errors.submit && (
        <div className="p-3 bg-danger-soft text-danger text-(length:--text-body-sm) rounded-[var(--radius-md)] border border-danger/20">
          {errors.submit}
        </div>
      )}

      <Input
        label="Trip Name"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Summer in Japan"
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-(length:--text-body-sm) text-secondary font-medium">
          Trip Dates <span className="text-terracotta">*</span>
        </label>
        <DateRangePicker 
          startDate={formData.startDate}
          endDate={formData.endDate}
          onChange={handleDateChange}
          error={errors.startDate || errors.endDate}
        />
        {(errors.startDate || errors.endDate) && (
          <span className="text-(length:--text-caption) text-danger">
            {errors.startDate || errors.endDate}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-(length:--text-body-sm) text-secondary font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="What's the goal of this journey?"
          className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] border border-border-default hover:border-border-strong text-(length:--text-body) bg-surface-elevated transition-colors focus:outline-none focus:border-terracotta resize-y"
        />
      </div>

      <Input
        label="Budget (USD)"
        name="budget"
        type="number"
        min="0"
        step="0.01"
        value={formData.budget}
        onChange={handleChange}
        error={errors.budget}
        placeholder="5000"
        required
      />

      <div className="space-y-3">
        <Input
          label="Cover Image URL"
          name="coverImage"
          value={formData.coverImage}
          onChange={(e) => {
            handleChange(e);
            if (e.target.value) setLocalImagePreview(null);
          }}
          error={errors.coverImage}
          placeholder="https://example.com/image.jpg"
        />
        
        <div className="flex items-center gap-4">
          <div className="text-(length:--text-body-sm) text-secondary font-medium">or</div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-(length:--text-body-sm) font-medium text-primary bg-surface-muted hover:bg-border-subtle px-4 py-2 rounded-[var(--radius-md)] transition-colors"
          >
            <ImagePlus size={16} />
            Upload from device
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*"
            className="hidden" 
          />
        </div>

        {currentCover && (
          <div className="mt-4 rounded-[var(--radius-xl)] overflow-hidden h-40 w-full max-w-sm border border-border-subtle relative group">
            <img 
              src={currentCover} 
              alt="Cover preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                if (!localImagePreview) setErrors(prev => ({...prev, coverImage: 'Failed to load image URL'}));
              }}
              onLoad={(e) => {
                e.target.style.display = 'block';
                if (!localImagePreview && errors.coverImage) setErrors(prev => ({...prev, coverImage: undefined}));
              }}
            />
            {localImagePreview && (
               <button 
                 type="button"
                 onClick={() => {
                   setLocalImagePreview(null);
                   if(fileInputRef.current) fileInputRef.current.value = '';
                 }}
                 className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 text-xs"
               >
                 Remove
               </button>
            )}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-border-subtle">
        <Button type="submit" loading={isSubmitting}>
          Create trip →
        </Button>
      </div>
    </form>
  );
};

export default TripForm;
