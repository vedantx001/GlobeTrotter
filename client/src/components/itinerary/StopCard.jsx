import { useState } from 'react';
import { ChevronDown, Trash2, Plus } from 'lucide-react';
import ActivityItem from './ActivityItem';

const StopCard = ({ 
  stop, 
  index,
  isOpen,
  onToggle,
  onRemove,
  onAddActivity,
  onRemoveActivity
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Group activities by time slot for visual hierarchy
  const groupedActivities = {
    Morning: [],
    Afternoon: [],
    Evening: [],
    Anytime: []
  };

  let totalCost = 0;
  
  if (stop.activities) {
    stop.activities.forEach(act => {
      const expense = act.custom_cost || act.cost || act.defaultCost || 0;
      totalCost += expense;

      const slot = act.time_slot || act.timeSlot;
      if (slot && groupedActivities[slot]) {
        groupedActivities[slot].push(act);
      } else if (slot === 'Morning' || slot === 'Afternoon' || slot === 'Evening') {
        groupedActivities[slot].push(act);
      } else {
        groupedActivities.Anytime.push(act);
      }
    });
  }

  const activityCount = stop.activities ? stop.activities.length : 0;
  const countLabel = activityCount === 1 ? '1 activity' : `${activityCount} activities`;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    }).toUpperCase();
  };

  const startDateStr = formatDate(stop.start_date || stop.startDate);
  const endDateStr = formatDate(stop.end_date || stop.endDate);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0);
  };

  return (
    <div className="relative pl-8 sm:pl-12 pb-8 border-l-2 border-border-subtle/60 ml-4 sm:ml-6 last:border-transparent last:pb-0 font-sans">
      
      {/* Timeline Node / Number */}
      <div className="absolute -left-[17px] top-4 w-8 h-8 rounded-full bg-surface-primary border border-border-default flex items-center justify-center font-display text-sm font-normal text-primary z-10 shadow-2xs">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="bg-surface-primary border border-border-subtle rounded-[var(--radius-xl)] shadow-2xs overflow-hidden transition-all">
        
        {/* Accordion Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-surface-primary hover:bg-surface-secondary/50 transition-colors">
          
          <button
            type="button"
            id={`stop-header-${stop.id}`}
            aria-expanded={isOpen}
            aria-controls={`stop-content-${stop.id}`}
            onClick={onToggle}
            className="flex-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-left cursor-pointer group"
          >
            {/* City Title & Dates */}
            <div className="space-y-0.5">
              <h2 className="font-display font-normal text-2xl sm:text-3xl lg:text-[34px] text-primary group-hover:text-terracotta transition-colors leading-tight">
                {stop.cityName || stop.city?.name || 'Destination'}
              </h2>
              {(startDateStr || endDateStr) && (
                <div className="font-sans text-xs font-medium tracking-wider text-secondary uppercase">
                  {startDateStr} {endDateStr ? `— ${endDateStr}` : ''}
                </div>
              )}
            </div>

            {/* Counts, Cost & Chevron Indicator */}
            <div className="flex items-center gap-4 sm:gap-6 pr-2 font-sans shrink-0">
              <span className="font-sans text-xs text-secondary font-medium hidden sm:inline-block">
                {countLabel}
              </span>

              {totalCost > 0 ? (
                <span className="font-sans text-xs sm:text-sm font-semibold text-primary">
                  {formatCurrency(totalCost)}
                </span>
              ) : (
                <span className="font-sans text-xs text-stone/60 hidden sm:inline-block">
                  $0
                </span>
              )}

              <div className="p-1 rounded-full bg-surface-muted/60 group-hover:bg-surface-muted transition-colors text-secondary group-hover:text-primary">
                <ChevronDown 
                  size={18} 
                  className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </div>
            </div>
          </button>

          {/* Delete Action Button */}
          <div className="pl-3 border-l border-border-subtle/50 ml-2 shrink-0">
            {!showConfirmDelete ? (
              <button 
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="p-1.5 rounded-full text-stone/60 hover:text-danger hover:bg-danger-soft transition-colors cursor-pointer"
                title="Remove Stop"
                aria-label="Remove Stop"
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-danger-soft px-2.5 py-1 rounded-full font-sans">
                <span className="text-[11px] text-danger font-medium">Remove?</span>
                <button 
                  type="button" 
                  onClick={() => onRemove(stop.id)} 
                  className="text-[11px] text-danger font-bold hover:underline cursor-pointer"
                >
                  Yes
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowConfirmDelete(false)} 
                  className="text-[11px] text-secondary hover:underline cursor-pointer"
                >
                  No
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Expanded Accordion Body */}
        <div
          id={`stop-content-${stop.id}`}
          role="region"
          aria-labelledby={`stop-header-${stop.id}`}
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden border-t border-border-subtle/60 bg-surface-primary/40">
            <div className="p-4 sm:p-6 space-y-6">
              
              {/* Optional Stop Notes */}
              {stop.notes && (
                <div className="p-3 px-4 bg-surface-secondary/60 rounded-lg border border-border-subtle/60 font-sans">
                  <p className="font-sans text-xs text-secondary italic">"{stop.notes}"</p>
                </div>
              )}

              {/* Time-Slot Grouped Activities */}
              {activityCount === 0 ? (
                <div className="py-6 px-4 text-center border border-dashed border-border-subtle/70 rounded-xl bg-surface-primary/40 font-sans">
                  <p className="font-sans text-xs text-secondary mb-3">
                    No activities planned yet for this destination.
                  </p>
                  <button
                    type="button"
                    onClick={() => onAddActivity(stop.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border-subtle bg-surface-primary text-xs font-medium text-terracotta hover:bg-surface-secondary hover:border-terracotta transition-all cursor-pointer font-sans shadow-2xs"
                  >
                    <Plus size={13} /> Add activity
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((slot) => {
                    const acts = groupedActivities[slot];
                    if (!acts || acts.length === 0) return null;

                    return (
                      <div key={slot} className="space-y-2">
                        <div className="font-sans text-[10px] font-semibold text-stone uppercase tracking-widest pl-2 border-l-2 border-terracotta/70">
                          {slot}
                        </div>
                        <div className="bg-surface-primary border border-border-subtle/50 rounded-xl divide-y divide-border-subtle/40">
                          {acts.map((act) => (
                            <ActivityItem key={act.id} activity={act} onRemove={() => onRemoveActivity(stop.id, act.id)} />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Activity Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onAddActivity(stop.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-terracotta hover:underline cursor-pointer font-sans"
                    >
                      <Plus size={12} /> Add activity
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StopCard;
