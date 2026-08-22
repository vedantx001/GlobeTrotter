import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import Button from '../common/Button';

const ItineraryHeader = ({ trip, stops, onOpenCalendar }) => {
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const startStr = formatDate(trip?.startDate);
  const endStr = formatDate(trip?.endDate);
  
  // Destination sequence string e.g. "Paris → Rome → Florence"
  const sequence = stops?.length > 0 
    ? stops.map(s => s.cityName || s.city?.name || s.city_id || 'City').join(' → ')
    : 'No destinations yet';

  return (
    <div className="flex flex-col mb-10 pb-6 border-b border-border-subtle/50 font-sans">
      <Link 
        to="/trips" 
        className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary font-medium transition-colors mb-6 w-fit font-sans"
      >
        <ArrowLeft size={14} /> Back to My Trips
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold tracking-wider text-terracotta uppercase block font-sans">
            JOURNEY BUILDER
          </span>
          <h1 className="font-display font-normal text-4xl sm:text-5xl lg:text-[56px] text-primary leading-tight">
            {trip?.title || 'Your Journey'}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm text-secondary font-medium pt-1 font-sans">
            {(startStr || endStr) && <span>{startStr} {endStr ? `— ${endStr}` : ''}</span>}
            {(startStr || endStr) && sequence && <span className="text-stone/40">•</span>}
            {sequence && <span className="text-primary font-semibold">{sequence}</span>}
          </div>
        </div>

        {/* Compact Calendar Action */}
        <div className="shrink-0 font-sans">
          <Button 
            variant="secondary" 
            onClick={onOpenCalendar} 
            className="inline-flex items-center gap-1.5 !px-3 !py-1.5 text-xs font-medium cursor-pointer font-sans shadow-2xs"
            aria-label="Open trip calendar"
          >
            <Calendar size={14} className="shrink-0 text-current" />
            <span>Calendar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryHeader;
