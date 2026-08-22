import { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import ActivityItem from './ActivityItem';

const StopCard = ({ 
  stop, 
  index, 
  isFirst, 
  isLast, 
  onMoveUp, 
  onMoveDown, 
  onRemove,
  onAddActivity,
  onRemoveActivity
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Group activities by time slot for visual hierarchy
  const groupedActivities = {
    Morning: [],
    Afternoon: [],
    Evening: []
  };
  
  if (stop.activities) {
    stop.activities.forEach(act => {
      if (groupedActivities[act.time_slot]) {
        groupedActivities[act.time_slot].push(act);
      } else {
        groupedActivities.Morning.push(act); // Fallback
      }
    });
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    }).toUpperCase();
  };

  return (
    <div className="relative pl-8 sm:pl-12 pb-12 border-l-2 border-border-subtle ml-4 sm:ml-6 last:border-transparent last:pb-0">
      
      {/* Timeline Node / Number */}
      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-ivory border-2 border-obsidian flex items-center justify-center font-display text-sm text-primary z-10 shadow-sm">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="bg-warm-white border border-border-subtle rounded-[var(--radius-2xl)] p-5 sm:p-7 shadow-[var(--shadow-card)] transition-all">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-(length:--text-heading-md) text-primary mb-1">
              {stop.cityName || stop.city?.name || 'Destination'}
            </h2>
            <div className="text-(length:--text-caption) font-medium tracking-wider text-terracotta uppercase">
              {formatDate(stop.start_date)} — {formatDate(stop.end_date)}
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={onMoveUp}
              disabled={isFirst}
              className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface-muted disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Move Up"
            >
              <ChevronUp size={18} />
            </button>
            <button 
              onClick={onMoveDown}
              disabled={isLast}
              className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface-muted disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Move Down"
            >
              <ChevronDown size={18} />
            </button>
            
            <div className="w-px h-5 bg-border-subtle mx-1" />
            
            {!showConfirmDelete ? (
              <button 
                onClick={() => setShowConfirmDelete(true)}
                className="p-1.5 rounded-md text-secondary hover:text-danger hover:bg-danger-soft transition-colors"
                title="Remove Stop"
              >
                <Trash2 size={18} />
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-danger-soft px-3 py-1 rounded-md">
                <span className="text-xs text-danger font-medium">Remove stop?</span>
                <button onClick={() => onRemove(stop.id)} className="text-xs text-danger font-bold hover:underline">Yes</button>
                <button onClick={() => setShowConfirmDelete(false)} className="text-xs text-secondary hover:underline">No</button>
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        {stop.notes && (
          <div className="mb-6 p-4 bg-surface-muted rounded-[var(--radius-lg)] border border-border-subtle">
            <p className="text-(length:--text-body-sm) text-secondary italic">"{stop.notes}"</p>
          </div>
        )}

        {/* Activities Timeline */}
        <div className="space-y-6 relative">
          
          {/* Loop over Time Slots */}
          {['Morning', 'Afternoon', 'Evening'].map((slot) => {
            const acts = groupedActivities[slot];
            if (!acts || acts.length === 0) return null;
            
            return (
              <div key={slot} className="relative">
                <h4 className="text-(length:--text-caption) font-medium text-stone uppercase tracking-widest mb-3 pl-4 border-l-2 border-border-default">
                  {slot}
                </h4>
                <div className="flex flex-col gap-1 ml-4 border-l border-border-subtle pl-4">
                  {acts.map((act) => (
                    <ActivityItem key={act.id} activity={act} onRemove={() => onRemoveActivity(stop.id, act.id)} />
                  ))}
                </div>
              </div>
            );
          })}
          
        </div>

        {/* Add Activity Button */}
        <div className="mt-6 pt-6 border-t border-border-subtle">
          <button
            onClick={() => onAddActivity(stop.id)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[var(--radius-md)] border border-dashed border-border-strong text-secondary hover:text-primary hover:border-terracotta hover:bg-surface-muted transition-all text-(length:--text-body-sm) font-medium"
          >
            <Plus size={16} />
            Add Activity
          </button>
        </div>

      </div>
    </div>
  );
};

export default StopCard;
