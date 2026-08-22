import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { updateUserProfile } from '../../api/profile_api';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const ProfileEditForm = ({ isOpen, onClose, onSuccess }) => {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input 
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input 
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input 
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input 
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <Input 
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

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

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-border-subtle mt-2">
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
