import { MapPin } from 'lucide-react';

const DestinationCard = ({ destination }) => {
  const imageUrl = destination.image || destination.imageUrl || null;
  const name = destination.name || destination.city;
  const country = destination.country;

  return (
    <div className="group cursor-pointer rounded-[var(--radius-2xl)] overflow-hidden relative h-64 md:h-72 w-full">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-surface-muted flex items-center justify-center text-stone/40">
          <MapPin size={40} />
        </div>
      )}

      {/* Gradient overlay for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end">
        <h3 className="font-display text-(length:--text-heading-sm) text-white mb-0.5 drop-shadow-sm">
          {name}
        </h3>
        <span className="text-white/80 text-(length:--text-body-sm) drop-shadow-sm">
          {country}
        </span>
      </div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-[var(--radius-lg)] text-(length:--text-caption) font-medium">
        Explore
      </div>
    </div>
  );
};

export default DestinationCard;
