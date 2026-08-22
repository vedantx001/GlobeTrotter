import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ItineraryHeader = ({ trip, stops }) => {
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    }).toUpperCase();
  };

  const startStr = formatDate(trip?.startDate);
  const endStr = formatDate(trip?.endDate);
  
  // Destination sequence string e.g. "Paris → Rome → Florence"
  const sequence = stops?.length > 0 
    ? stops.map(s => s.city?.name || s.cityName || s.city_id || 'City').join(' → ')
    : 'No destinations yet';

  return (
    <div className="flex flex-col mb-12">
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-1.5 text-(length:--text-body-sm) text-secondary hover:text-primary font-medium transition-colors mb-6 w-fit"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="inline-block text-(length:--text-caption) tracking-wider font-semibold text-terracotta uppercase mb-2">
            {startStr} {endStr ? `— ${endStr}` : ''} {trip?.startDate && new Date(trip.startDate).getFullYear()}
          </span>
          <h1 className="font-display text-(length:--text-heading-xl) text-primary leading-none mb-3">
            {trip?.title || 'Your Journey'}
          </h1>
          <p className="text-(length:--text-body-lg) text-secondary">
            {sequence}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItineraryHeader;
