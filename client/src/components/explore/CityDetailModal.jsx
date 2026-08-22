import Modal from '../common/Modal';
import Button from '../common/Button';
import { TrendingUp, MapPin, Tag } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CityDetailModal = ({ isOpen, onClose, city }) => {
  const [isAdding, setIsAdding] = useState(false);

  if (!city) return null;

  const handleAddToTrip = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      toast.success(`Added ${city.name} to your destinations!`);
      onClose();
    }, 600);
  };

  const costString = Array(city.costIndex).fill('$').join('');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Destination Details" maxWidth="max-w-2xl">
      <div className="flex flex-col gap-6">
        
        {/* Header section */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-display text-(length:--text-heading-md) text-primary">{city.name}</h2>
            <div className="flex items-center gap-1 bg-surface-muted text-secondary px-3 py-1.5 rounded-md shrink-0 ml-4">
              <TrendingUp size={16} />
              <span className="font-bold">{city.popularityScore}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary uppercase tracking-wider font-medium">
            <MapPin size={16} />
            <span>{city.region}, {city.country?.name}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 py-6 border-y border-border-subtle">
          <div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Cost Index</div>
            <div className="text-lg font-medium text-terracotta">
              {costString}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Country</div>
            <div className="font-medium text-primary">
              {city.country?.name}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-bold text-primary mb-2">About {city.name}</h3>
          <p className="text-(length:--text-body) text-stone leading-relaxed">
            {city.description}
          </p>
        </div>

        {/* Tags */}
        {city.tags && city.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={16} className="text-secondary" />
              <h3 className="text-sm font-bold text-primary">Vibe</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {city.tags.map(tag => (
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

export default CityDetailModal;
