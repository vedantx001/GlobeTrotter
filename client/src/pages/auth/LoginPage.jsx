import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthField from '../../components/auth/AuthField';
import PasswordField from '../../components/auth/PasswordField';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState('');

  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});
    
    try {
      await login({ email: formData.email, password: formData.password });
      if (formData.email === 'admin@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password. Please try again.';
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setForgotPasswordStatus('');
    setErrors({});
    
    try {
      await forgotPassword(formData.email);
      setForgotPasswordStatus('If an account exists, a reset link has been sent to your email.');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to connect to the server.';
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (forgotPasswordMode) {
    return (
      <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-8 sm:p-10 w-full">
        <div className="mb-5">
          <h1 className="text-lg sm:text-xl font-semibold text-primary tracking-tight mb-1">Reset Password</h1>
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
            <Button type="submit" loading={isSubmitting}>
              Send reset link
            </Button>
            
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
    <div className="bg-warm-white rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] border border-border-subtle p-8 sm:p-10 w-full max-w-[420px] mx-auto">
      <div className="mb-5">
        <h1 className="text-lg sm:text-xl font-semibold text-primary tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="text-secondary text-(length:--text-body-sm)">
          Continue planning your next journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {successMessage && (
          <div className="p-3 bg-success-soft text-success text-(length:--text-body-sm) rounded-[var(--radius-md)] border border-border-subtle">
            {successMessage}
          </div>
        )}
        
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
          <Button type="submit" loading={isSubmitting}>
            Sign in →
          </Button>
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
