import { ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ItineraryActivityRow from './ItineraryActivityRow';

const ItineraryDayAccordion = ({
  id,
  section,
  isOpen,
  onToggle,
  tripId
}) => {
  const navigate = useNavigate();
  const activityCount = section.activities ? section.activities.length : 0;
  const countLabel = activityCount === 1 ? '1 activity' : `${activityCount} activities`;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0);
  };

  return (
    <div className="mb-4 font-sans">
      {/* Accordion Header Button */}
      <button
        type="button"
        id={`day-header-${id}`}
        aria-expanded={isOpen}
        aria-controls={`day-content-${id}`}
        onClick={onToggle}
        className={`w-full flex items-center justify-between py-4 px-4 sm:px-6 bg-surface-primary hover:bg-surface-secondary/70 border transition-all text-left shadow-2xs group cursor-pointer ${
          isOpen 
            ? 'rounded-t-[var(--radius-xl)] border-border-default border-b-border-subtle/50' 
            : 'rounded-[var(--radius-xl)] border-border-subtle hover:border-border-default'
        }`}
      >
        {/* Left Info: Title & Subtitle */}
        <div className="flex items-baseline flex-wrap gap-2.5 sm:gap-4 shrink-0">
          <span className="font-display font-normal text-2xl sm:text-3xl text-primary leading-none group-hover:text-terracotta transition-colors">
            {section.title}
          </span>
          {section.subtitle && (
            <span className="font-sans text-xs sm:text-sm font-medium text-secondary tracking-wider uppercase">
              {section.subtitle}
            </span>
          )}
        </div>

        {/* Right Info: Count, Cost & Chevron */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0 font-sans">
          <span className="font-sans text-xs text-secondary font-medium hidden sm:inline-block">
            {countLabel}
          </span>

          {section.totalExpense > 0 ? (
            <span className="font-sans text-xs sm:text-sm font-semibold text-primary">
              {formatCurrency(section.totalExpense)}
            </span>
          ) : (
            <span className="font-sans text-xs text-stone/60 hidden sm:inline-block">
              $0
            </span>
          )}

          <div className="p-1 rounded-full bg-surface-muted/50 group-hover:bg-surface-muted transition-colors text-secondary group-hover:text-primary">
            <ChevronDown 
              size={18} 
              className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </div>
        </div>
      </button>

      {/* Accordion Content Container */}
      <div
        id={`day-content-${id}`}
        role="region"
        aria-labelledby={`day-header-${id}`}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden border-x border-b border-border-subtle/80 bg-surface-primary/50 rounded-b-[var(--radius-xl)] shadow-2xs">
          <div className="p-4 sm:p-6 space-y-4">
            
            {activityCount === 0 ? (
              /* Empty Day State */
              <div className="py-6 px-4 text-center border border-dashed border-border-subtle/70 rounded-xl bg-surface-primary/40 font-sans">
                <p className="font-sans text-xs text-secondary mb-3">
                  No activities planned yet for this day.
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/builder/${tripId}`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border-subtle bg-surface-primary text-xs font-medium text-terracotta hover:bg-surface-secondary hover:border-terracotta transition-all cursor-pointer font-sans shadow-2xs"
                >
                  <Plus size={13} /> Add activity
                </button>
              </div>
            ) : (
              /* Timeline Activities List */
              <div className="space-y-1">
                <div className="divide-y divide-border-subtle/40">
                  {section.activities.map((act) => (
                    <ItineraryActivityRow key={act.id || act._id} activity={act} />
                  ))}
                </div>

                {/* Bottom Add Activity Action */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(`/builder/${tripId}`)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-terracotta hover:underline cursor-pointer font-sans"
                  >
                    <Plus size={12} /> Add more activities
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDayAccordion;
