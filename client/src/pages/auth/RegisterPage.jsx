import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthField from '../../components/auth/AuthField';
import PasswordField from '../../components/auth/PasswordField';
import Button from '../../components/common/Button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    password: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';

    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setErrors({ submit: 'Backend registration will be connected in a future update.' });
    }, 1000);
  };

  return (
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-6 sm:p-8 w-full max-w-[680px] mx-auto">
      <div className="mb-5">
        <h1 className="font-display text-(length:--text-heading-md) text-primary mb-1.5 leading-[1.05]">
          Create your<br />account.
        </h1>
        <p className="text-secondary text-(length:--text-body-sm)">
          Start planning journeys with GlobeTrotter.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {errors.submit && (
          <div className="p-3 bg-info-soft text-info text-(length:--text-body-sm) rounded-[var(--radius-md)] border border-border-subtle">
            {errors.submit}
          </div>
        )}

        {/* 2 Column Layout for Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AuthField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            disabled={isSubmitting}
            placeholder="Jane"
            required
          />
          <AuthField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            disabled={isSubmitting}
            placeholder="Doe"
            required
          />
        </div>

        {/* 2 Column Layout for Email/Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AuthField
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isSubmitting}
            placeholder="name@example.com"
            required
          />
          <AuthField
            label="Phone number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            disabled={isSubmitting}
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>

        {/* 2 Column Layout for City/Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AuthField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            disabled={isSubmitting}
            placeholder="London"
            required
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="country" className="text-(length:--text-body-sm) text-secondary font-medium">
              Country <span className="text-terracotta">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2.5 rounded-[var(--radius-md)] border text-(length:--text-body) bg-surface-elevated transition-colors duration-200 focus:outline-none focus:border-terracotta disabled:opacity-60 disabled:cursor-not-allowed ${errors.country ? 'border-danger' : 'border-border-default hover:border-border-strong'
                }`}
            >
              <option value="" disabled>Select a country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
              <option value="JP">Japan</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.country && (
              <span className="text-(length:--text-caption) text-danger mt-1">{errors.country}</span>
            )}
          </div>
        </div>

        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isSubmitting}
          placeholder="••••••••"
          required
        />

        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="additionalInfo" className="text-(length:--text-body-sm) text-secondary font-medium">
            Additional information
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Any special travel preferences or dietary requirements?"
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] border border-border-default hover:border-border-strong text-(length:--text-body) bg-surface-elevated transition-colors duration-200 focus:outline-none focus:border-terracotta disabled:opacity-60 disabled:cursor-not-allowed resize-y"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" loading={isSubmitting}>
            Create account →
          </Button>
        </div>
      </form>

      <div className="mt-5 pt-4 border-t border-border-subtle text-center text-(length:--text-body-sm) text-secondary">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-primary font-medium hover:text-terracotta transition-colors focus:outline-none focus:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
