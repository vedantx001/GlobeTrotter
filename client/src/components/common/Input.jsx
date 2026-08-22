const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  min,
  max,
  step,
  error,
  helperText,
  className = '',
  ...rest
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-(length:--text-body-sm) text-secondary font-medium">
          {label} {required && <span className="text-terracotta">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3.5 py-2.5 rounded-[var(--radius-md)] border text-(length:--text-body) bg-surface-elevated transition-colors duration-200 focus:outline-none focus:border-terracotta disabled:opacity-60 disabled:cursor-not-allowed ${
          error ? 'border-danger' : 'border-border-default hover:border-border-strong'
        }`}
        {...rest}
      />
      {error ? (
        <span className="text-(length:--text-caption) text-danger">{error}</span>
      ) : helperText ? (
        <span className="text-(length:--text-caption) text-secondary">{helperText}</span>
      ) : null}
    </div>
  );
};

export default Input;
