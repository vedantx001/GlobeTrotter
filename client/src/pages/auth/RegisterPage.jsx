import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthField from '../../components/auth/AuthField';
import PasswordField from '../../components/auth/PasswordField';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { useAuth } from '../../context/AuthContext';

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
  const { register } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});
    
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        password: formData.password
      };
      
      const response = await register(payload);
      
      if (response.data?.token || response.token) {
        navigate('/dashboard');
      } else {
        navigate('/login', { state: { successMessage: 'Account created successfully! Please sign in.' } });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to connect to the server.';
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-6 sm:p-8 w-full max-w-[680px] mx-auto">
      <div className="mb-4">
        <h1 className="text-sm sm:text-base font-semibold text-primary tracking-tight mb-1">
          Create your account
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
            placeholder="Karan"
            required
          />
          <AuthField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            disabled={isSubmitting}
            placeholder="Patel"
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
            placeholder="karan@example.com"
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
            placeholder="+91 9265147936"
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
            placeholder="Delhi"
            required
          />

          <Select
            label="Country"
            name="country"
            id="country"
            value={formData.country}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.country}
            placeholder="Select a country"
            options={[
              { value: 'US', label: 'United States' },
              { value: 'UK', label: 'United Kingdom' },
              { value: 'CA', label: 'Canada' },
              { value: 'AU', label: 'Australia' },
              { value: 'IN', label: 'India' },
              { value: 'FR', label: 'France' },
              { value: 'DE', label: 'Germany' },
              { value: 'IT', label: 'Italy' },
              { value: 'ES', label: 'Spain' },
              { value: 'JP', label: 'Japan' },
              { value: 'OTHER', label: 'Other' }
            ]}
            required
          />
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
