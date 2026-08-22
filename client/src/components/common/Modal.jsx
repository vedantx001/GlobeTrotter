import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-primary/40 backdrop-blur-sm">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div 
        className={`relative w-full ${maxWidth} bg-surface-primary rounded-[var(--radius-2xl)] shadow-[var(--shadow-modal)] border border-border-default overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-full flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex shrink-0 items-center justify-between p-5 sm:p-6 border-b border-border-subtle">
          <h2 id="modal-title" className="font-display text-xl sm:text-2xl text-primary font-medium tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
