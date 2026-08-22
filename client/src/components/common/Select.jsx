import { useState, useRef, useEffect, Children, isValidElement } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * GlobeTrotter Custom Theme-styled Select Component
 * Replaces browser-default HTML select with a refined, accessible dropdown
 * matching the GlobeTrotter design system (warm surfaces, terracotta accents, subtle borders).
 */
const Select = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  children,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error,
  helperText,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  triggerClassName = '',
  menuClassName = '',
  align = 'left',
  icon: Icon = null,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Extract options from props or children
  let parsedOptions = [];

  if (options && options.length > 0) {
    parsedOptions = options.map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        return {
          value: opt.value !== undefined ? opt.value : '',
          label: opt.label !== undefined ? opt.label : String(opt.value),
          disabled: !!opt.disabled,
          icon: opt.icon || null,
        };
      }
      return {
        value: String(opt),
        label: String(opt),
        disabled: false,
        icon: null,
      };
    });
  } else if (children) {
    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        if (child.type === 'option' || child.props) {
          parsedOptions.push({
            value: child.props.value !== undefined ? child.props.value : '',
            label: child.props.children || child.props.label || String(child.props.value || ''),
            disabled: !!child.props.disabled,
            icon: child.props.icon || null,
          });
        }
      }
    });
  }

  // Find currently selected option
  const selectedOption = parsedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle option selection
  const handleSelect = (option) => {
    if (option.disabled || disabled) return;

    setIsOpen(false);

    if (onChange) {
      // Create synthetic event for compatibility with standard form handlers
      const syntheticEvent = {
        target: {
          name: name || id || '',
          value: option.value,
        },
        currentTarget: {
          name: name || id || '',
          value: option.value,
        },
      };

      onChange(syntheticEvent, option.value);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = parsedOptions.findIndex(
          (opt) => String(opt.value) === String(value)
        );
        const nextIndex = Math.min(currentIndex + 1, parsedOptions.length - 1);
        if (nextIndex >= 0 && !parsedOptions[nextIndex].disabled) {
          handleSelect(parsedOptions[nextIndex]);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = parsedOptions.findIndex(
          (opt) => String(opt.value) === String(value)
        );
        const prevIndex = Math.max(currentIndex - 1, 0);
        if (prevIndex >= 0 && !parsedOptions[prevIndex].disabled) {
          handleSelect(parsedOptions[prevIndex]);
        }
      }
    }
  };

  // Sizing styles
  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-(length:--text-body-sm) rounded-[var(--radius-md)] gap-2',
    md: 'px-3.5 py-2.5 text-(length:--text-body) rounded-[var(--radius-md)] gap-2.5',
    lg: 'px-4 py-3 text-(length:--text-body) rounded-[var(--radius-lg)] gap-3',
  };

  return (
    <div className={`relative flex flex-col gap-1.5 ${className}`} ref={containerRef} {...rest}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id || name}
          className="text-(length:--text-body-sm) text-secondary font-medium"
        >
          {label} {required && <span className="text-terracotta">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={id || name}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between border bg-surface-elevated text-left transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
          sizeStyles[size] || sizeStyles.md
        } ${
          error
            ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
            : isOpen
            ? 'border-terracotta ring-2 ring-terracotta/20 shadow-sm'
            : 'border-border-default hover:border-border-strong shadow-xs'
        } ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={16} className="text-secondary shrink-0" />}
          {selectedOption ? (
            <span className="text-primary truncate font-normal">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-text-muted truncate">
              {placeholder}
            </span>
          )}
        </div>

        <ChevronDown
          size={16}
          className={`text-secondary shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-terracotta' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute z-50 top-full mt-1.5 w-full min-w-[160px] max-h-60 overflow-y-auto bg-surface-elevated/98 backdrop-blur-md border border-border-subtle rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-1.5 animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${menuClassName}`}
          style={{ scrollbarWidth: 'thin' }}
        >
          {parsedOptions.length === 0 ? (
            <div className="px-3 py-2 text-(length:--text-body-sm) text-text-muted text-center">
              No options available
            </div>
          ) : (
            parsedOptions.map((opt, idx) => {
              const isSelected = String(opt.value) === String(value);

              return (
                <div
                  key={`${opt.value}-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt)}
                  className={`px-3 py-2 rounded-[var(--radius-md)] text-(length:--text-body-sm) flex items-center justify-between transition-colors duration-150 select-none ${
                    opt.disabled
                      ? 'opacity-40 cursor-not-allowed text-text-muted'
                      : isSelected
                      ? 'bg-terracotta/10 text-terracotta font-medium cursor-pointer'
                      : 'text-primary hover:bg-surface-muted/80 hover:text-terracotta cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  {isSelected && (
                    <Check size={15} className="text-terracotta shrink-0 ml-2 animate-in fade-in" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Error / Helper text */}
      {error ? (
        <span className="text-(length:--text-caption) text-danger mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-(length:--text-caption) text-secondary mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
};

export default Select;
