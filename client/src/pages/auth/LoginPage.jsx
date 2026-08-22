import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthField from '../../components/auth/AuthField';
import PasswordField from '../../components/auth/PasswordField';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!forgotPasswordMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
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
      setErrors({ submit: 'Authentication is not connected yet.' });
    }, 1000);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setForgotPasswordStatus('Backend password recovery will be connected in a future update.');
    }, 1000);
  };

  if (forgotPasswordMode) {
    return (
      <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-8 sm:p-10 w-full">
        <div className="mb-8">
          <h1 className="font-display text-(length:--text-heading-md) text-primary mb-2">Reset Password</h1>
          <p className="text-secondary text-(length:--text-body-sm)">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleForgotPasswordSubmit} className="space-y-6" noValidate>
          <AuthField
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isSubmitting}
            placeholder="name@example.com"
          />

          {forgotPasswordStatus && (
            <div className="p-3 bg-info-soft text-info text-(length:--text-body-sm) rounded-[var(--radius-md)] border border-border-subtle">
              {forgotPasswordStatus}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-obsidian text-warm-white py-2.5 px-4 rounded-[var(--radius-md)] font-medium text-(length:--text-body) transition-transform active:scale-[0.98] hover:bg-obsidian/90 focus:outline-none focus:ring-2 focus:ring-obsidian/50 focus:ring-offset-2 focus:ring-offset-warm-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setForgotPasswordMode(false);
                setForgotPasswordStatus('');
                setErrors({});
              }}
              className="text-secondary hover:text-primary transition-colors text-(length:--text-body-sm) font-medium"
            >
              ← Back to sign in
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-8 sm:p-10 w-full">
      <div className="mb-8">
        <h1 className="font-display text-(length:--text-heading-md) text-primary mb-2 leading-none">
          Welcome back.
        </h1>
        <p className="text-secondary text-(length:--text-body-sm)">
          Continue planning your next journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {errors.submit && (
          <div className="p-3 bg-warning-soft text-warning text-(length:--text-body-sm) rounded-[var(--radius-md)] border border-border-subtle">
            {errors.submit}
          </div>
        )}

        <AuthField
          label="Email address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isSubmitting}
          placeholder="name@example.com"
        />

        <div className="space-y-1.5">
          <PasswordField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isSubmitting}
            placeholder="••••••••"
          />
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                setForgotPasswordMode(true);
                setErrors({});
              }}
              className="text-(length:--text-caption) text-secondary hover:text-primary transition-colors focus:outline-none focus:underline"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-obsidian text-warm-white py-2.5 px-4 rounded-[var(--radius-md)] font-medium text-(length:--text-body) transition-transform active:scale-[0.98] hover:bg-obsidian/90 focus:outline-none focus:ring-2 focus:ring-obsidian/50 focus:ring-offset-2 focus:ring-offset-warm-white disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in →'}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-border-subtle text-center text-(length:--text-body-sm) text-secondary">
        Don't have an account?{' '}
        <Link 
          to="/register" 
          className="text-primary font-medium hover:text-terracotta transition-colors focus:outline-none focus:underline"
        >
          Create account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
