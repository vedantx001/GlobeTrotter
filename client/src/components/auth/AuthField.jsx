import { useId } from 'react';

const AuthField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error, 
  disabled, 
  required 
}) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-(length:--text-body-sm) text-secondary font-medium">
        {label} {required && <span className="text-terracotta">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-[var(--radius-md)] border text-(length:--text-body) bg-surface-elevated transition-colors duration-200 focus:outline-none focus:border-terracotta disabled:opacity-60 disabled:cursor-not-allowed ${
          error ? 'border-danger' : 'border-border-default hover:border-border-strong'
        }`}
      />
      {error && (
        <span className="text-(length:--text-caption) text-danger mt-1">{error}</span>
      )}
    </div>
  );
};

export default AuthField;
