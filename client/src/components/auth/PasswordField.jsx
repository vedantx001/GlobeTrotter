import { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  error, 
  disabled, 
  required 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-(length:--text-body-sm) text-secondary font-medium">
        {label} {required && <span className="text-terracotta">*</span>}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`w-full px-3.5 py-2.5 rounded-[var(--radius-md)] border text-(length:--text-body) bg-surface-elevated transition-colors duration-200 focus:outline-none focus:border-terracotta disabled:opacity-60 disabled:cursor-not-allowed pr-11 ${
            error ? 'border-danger' : 'border-border-default hover:border-border-strong'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <span className="text-(length:--text-caption) text-danger mt-1">{error}</span>
      )}
    </div>
  );
};

export default PasswordField;
