import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { updateUserProfile } from '../../api/profile_api';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Camera, Upload } from 'lucide-react';

const ProfileEditForm = ({ isOpen, onClose, onSuccess }) => {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    city: '',
    country: '',
    bio: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        city: user.city || '',
        country: user.country || '',
        bio: user.bio || ''
      });
      setError(null);
      setValidationError('');
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationError('Image size should be less than 5MB.');
        return;
      }
      setValidationError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    if (!formData.name.trim()) {
      setValidationError('Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setValidationError('Email is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateUserProfile(formData);
      
      // Update local state if backend succeeds
      updateUser(formData);
      onSuccess();
    } catch (err) {
      console.error('Failed to update profile:', err);
      // Simulate failure because endpoint might not exist
      setError('The profile service is temporarily unavailable. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Edit Profile"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Full Name & Email Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Input 
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Jane Doe"
            required
          />
          <Input 
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />
        </div>

        {/* Phone & Photo Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Input 
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +1 (555) 000-0000"
          />
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-(length:--text-body-sm) text-secondary font-medium">
              Profile Photo
            </label>
            <div className="flex items-center gap-2.5">
              {formData.avatar ? (
                <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden border border-border-default shadow-xs bg-surface-muted">
                  <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 shrink-0 rounded-full bg-surface-muted border border-border-default flex items-center justify-center text-secondary">
                  <Camera size={16} />
                </div>
              )}
              <div className="relative flex-1">
                <input
                  id="avatar"
                  name="avatar"
                  type="text"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="Paste URL or choose photo"
                  className="w-full pl-3 pr-9 py-2.5 rounded-md border border-border-default hover:border-border-strong text-sm bg-surface-elevated transition-colors duration-200 focus:outline-none focus:border-terracotta"
                />
                <label
                  htmlFor="photoUploadInput"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-secondary hover:text-terracotta cursor-pointer transition-colors rounded hover:bg-surface-muted"
                  title="Upload photo from device"
                >
                  <Upload size={15} />
                  <input
                    id="photoUploadInput"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* City & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Input 
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Paris, London, Delhi"
          />
          <Input 
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g. France, UK, India"
          />
        </div>

        {/* About Me Bio */}
        <div>
          <label className="block text-[10px] sm:text-(length:--text-caption) font-bold text-primary mb-2 uppercase tracking-wider">
            About Me
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell the community about your travel style..."
            className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-border-default bg-surface-elevated focus:outline-none focus:border-terracotta transition-colors text-(length:--text-body-sm) min-h-[100px] resize-y"
          />
        </div>

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

        <div className="flex items-center justify-end gap-4 pt-5 border-t border-border-subtle mt-1">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileEditForm;

