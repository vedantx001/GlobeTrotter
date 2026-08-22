import Modal from '../common/Modal';
import Button from '../common/Button';
import { Star, MapPin, Clock, IndianRupee, Tag, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ActivityDetailModal = ({ isOpen, onClose, place }) => {
  const [isAdding, setIsAdding] = useState(false);

  if (!place) return null;

  const handleAddToTrip = () => {
    setIsAdding(true);
    // Simulate frontend addition
    setTimeout(() => {
      setIsAdding(false);
      toast.success(`Added ${place.name} to your trip plan!`);
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Activity Details" maxWidth="max-w-2xl">
      <div className="flex flex-col gap-6">
        
        {/* Header section */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-display text-(length:--text-heading-md) text-primary">{place.name}</h2>
            <div className="flex items-center gap-1 bg-terracotta/10 text-terracotta px-3 py-1.5 rounded-md shrink-0 ml-4">
              <Star size={16} className="fill-current" />
              <span className="font-bold">{place.rating}</span>
            </div>
          </div>
          <div className="text-lg font-medium text-primary mb-2">
            {place.activity?.title}
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <MapPin size={16} />
            <span>{place.city?.name}, {place.country?.name}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-border-subtle">
          <div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Estimated Cost</div>
            <div className="flex items-center gap-1 font-medium text-primary">
              <IndianRupee size={16} className="text-secondary" />
              <span>{place.estimatedCost}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Duration</div>
            <div className="flex items-center gap-1 font-medium text-primary">
              <Clock size={16} className="text-secondary" />
              <span>{place.durationHours} hours</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Best Season</div>
            <div className="font-medium text-primary">
              {place.bestSeason}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Category</div>
            <div className="font-medium text-primary">
              {place.activity?.category}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-bold text-primary mb-2">About this experience</h3>
          <p className="text-(length:--text-body) text-stone leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={16} className="text-secondary" />
              <h3 className="text-sm font-bold text-primary">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {place.tags.map(tag => (
                <span key={tag} className="text-xs bg-surface-muted text-secondary px-3 py-1.5 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="mt-4 pt-6 border-t border-border-subtle flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto px-6">
            Cancel
          </Button>
          <Button onClick={handleAddToTrip} loading={isAdding} className="w-full sm:w-auto px-8">
            Add to Trip
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ActivityDetailModal;
