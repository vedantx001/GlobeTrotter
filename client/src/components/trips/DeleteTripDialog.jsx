import { X, Trash2 } from 'lucide-react';
import Button from '../common/Button';

const DeleteTripDialog = ({ isOpen, trip, onClose, onConfirm, isDeleting }) => {
  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-obsidian/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-ivory rounded-[var(--radius-3xl)] shadow-[var(--shadow-modal)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="w-10 h-10 rounded-full bg-danger-soft flex items-center justify-center text-danger">
            <Trash2 size={20} />
          </div>
          <button onClick={onClose} className="p-2 text-secondary hover:text-primary hover:bg-surface-muted rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          <h2 className="font-display text-(length:--text-heading-sm) text-primary mb-2">
            Delete this trip?
          </h2>
          <p className="text-(length:--text-body-sm) text-secondary mb-4">
            Are you sure you want to delete <span className="font-medium text-primary">"{trip.title}"</span>? This will permanently remove the trip and its entire itinerary. This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            onClick={() => onConfirm(trip.id || trip._id)} 
            loading={isDeleting}
            className="!bg-danger hover:!bg-danger/90 text-white border-transparent"
          >
            Delete trip
          </Button>
        </div>

      </div>
    </div>
  );
};

export default DeleteTripDialog;
