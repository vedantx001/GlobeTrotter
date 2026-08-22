import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  type = 'button', 
  onClick, 
  disabled, 
  loading, 
  variant = 'primary', 
  className = '', 
  'aria-label': ariaLabel 
}) => {
  const baseStyles = "w-full py-2.5 px-4 rounded-[var(--radius-md)] font-medium text-(length:--text-body) transition-transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-obsidian text-warm-white hover:bg-obsidian/90 focus:ring-obsidian/50 focus:ring-offset-warm-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      aria-label={ariaLabel}
    >
      {loading && <Loader2 className="animate-spin" size={18} />}
      {!loading && children}
      {loading && <span>{children}</span>}
    </button>
  );
};

export default Button;


