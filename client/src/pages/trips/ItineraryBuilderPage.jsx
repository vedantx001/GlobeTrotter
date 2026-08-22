import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  getTripItinerary, 
  addTripStop, 
  deleteTripStop, 
  reorderTripStops,
  addActivityToStop,
  removeItineraryActivity
} from '../../api/trips_api';

import ItineraryHeader from '../../components/itinerary/ItineraryHeader';
import StopCard from '../../components/itinerary/StopCard';
import CitySearchModal from '../../components/itinerary/CitySearchModal';
import ActivitySearchModal from '../../components/itinerary/ActivitySearchModal';
import Button from '../../components/common/Button';
import CalendarOverlay from '../../components/calendar/CalendarOverlay';

const ItineraryBuilderPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Accordion state
  const [openStops, setOpenStops] = useState({});

  // Modal states
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const data = await getTripItinerary(tripId);
        setTrip(data.trip || data);
        const initialStops = data.stops || [];
        setStops(initialStops);

        // Expand all stops by default
        const initialOpenMap = {};
        initialStops.forEach(s => {
          initialOpenMap[s.id] = true;
        });
        setOpenStops(initialOpenMap);
      } catch (err) {
        setError('Failed to load itinerary. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItinerary();
  }, [tripId]);

  const toggleStop = (stopId) => {
    setOpenStops(prev => ({
      ...prev,
      [stopId]: !prev[stopId]
    }));
  };

  const handleExpandAll = () => {
    const allOpen = {};
    stops.forEach(s => {
      allOpen[s.id] = true;
    });
    setOpenStops(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenStops({});
  };

  const allAreExpanded = stops.length > 0 && stops.every(s => !!openStops[s.id]);

  const handleAddStop = async (stopPayload) => {
    const nextOrder = stops.length > 0 ? Math.max(...stops.map(s => s.stop_order || 0)) + 1 : 1;
    
    const payload = {
      ...stopPayload,
      stop_order: nextOrder
    };

    const newStop = await addTripStop(tripId, payload);
    setStops(prev => [...prev, newStop]);
    setOpenStops(prev => ({ ...prev, [newStop.id]: true }));
  };

  const handleRemoveStop = async (stopId) => {
    await deleteTripStop(tripId, stopId);
    setStops(prev => prev.filter(s => s.id !== stopId));
  };

  const handleReorder = async (currentIndex, direction) => {
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= stops.length) return;

    const newStops = [...stops];
    const temp = newStops[currentIndex];
    newStops[currentIndex] = newStops[newIndex];
    newStops[newIndex] = temp;
    
    const updatedStops = newStops.map((s, i) => ({ ...s, stop_order: i + 1 }));
    setStops(updatedStops);

    const payload = updatedStops.map(s => ({ stopId: s.id, order: s.stop_order }));
    try {
      await reorderTripStops(tripId, payload);
    } catch (err) {
      console.error("Reorder failed, restoring state...");
    }
  };

  const handleAddActivity = async (activityPayload) => {
    if (!activeStopForActivity) return;
    
    const newActivity = await addActivityToStop(activeStopForActivity.id, activityPayload);
    
    setStops(prev => prev.map(stop => {
      if (stop.id === activeStopForActivity.id) {
        return {
          ...stop,
          activities: [...(stop.activities || []), newActivity]
        };
      }
      return stop;
    }));
  };

  const handleRemoveActivity = async (stopId, activityId) => {
    await removeItineraryActivity(activityId);
    
    setStops(prev => prev.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          activities: (stop.activities || []).filter(a => a.id !== activityId)
        };
      }
      return stop;
    }));
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto pb-20 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin mx-auto my-20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1400px] mx-auto pb-20 pt-12 text-center px-4 font-sans">
        <p className="text-secondary text-sm mb-6">{error}</p>
        <Button onClick={() => navigate('/trips')} variant="secondary" className="!w-auto px-6 text-xs font-sans cursor-pointer">
          Return to My Trips
        </Button>
      </div>
    );
  }

  const stopCountLabel = stops.length === 1 ? '1 STOP' : `${stops.length} STOPS`;

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-24 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 font-sans">
      
      <ItineraryHeader 
        trip={trip} 
        stops={stops} 
        onOpenCalendar={() => setIsCalendarOpen(true)}
      />

      <div className="mt-8">
        {stops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface-primary border border-border-subtle rounded-[var(--radius-2xl)] text-center shadow-2xs">
            <h3 className="font-display text-2xl sm:text-3xl text-primary mb-2">
              Your journey starts here.
            </h3>
            <p className="text-xs sm:text-sm text-secondary max-w-md mb-8 font-sans">
              Add your first destination to begin building out the itinerary timeline.
            </p>
            <Button onClick={() => setIsCityModalOpen(true)} className="!w-auto px-6 py-2.5 text-xs font-medium cursor-pointer font-sans">
              + Add a stop
            </Button>
          </div>
        ) : (
          <div>
            {/* Section Header & Global Expand/Collapse Action */}
            <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-border-subtle/50">
              <div className="flex items-baseline gap-3">
                <h3 className="font-display font-normal text-3xl sm:text-4xl text-primary">
                  YOUR JOURNEY
                </h3>
                <span className="font-sans text-xs text-secondary font-medium tracking-wider">
                  {stopCountLabel}
                </span>
              </div>

              {/* Global Expand/Collapse Control */}
              <button
                type="button"
                onClick={allAreExpanded ? handleCollapseAll : handleExpandAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-subtle bg-surface-primary text-xs font-medium text-secondary hover:text-primary hover:border-border-default transition-all cursor-pointer font-sans shadow-2xs"
                aria-label={allAreExpanded ? 'Collapse all stops' : 'Expand all stops'}
              >
                {allAreExpanded ? (
                  <>
                    <span>Collapse all</span>
                    <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    <span>Expand all</span>
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
            </div>
            
            {/* City Stops Accordion List */}
            <div className="space-y-0">
              {stops.map((stop, index) => (
                <StopCard 
                  key={stop.id}
                  stop={stop}
                  index={index}
                  isOpen={!!openStops[stop.id]}
                  onToggle={() => toggleStop(stop.id)}
                  onRemove={handleRemoveStop}
                  onAddActivity={() => setActiveStopForActivity(stop)}
                  onRemoveActivity={handleRemoveActivity}
                />
              ))}
            </div>

            {/* Bottom Timeline Action: Add another stop */}
            <div className="pl-8 sm:pl-12 mt-6 ml-4 sm:ml-6">
              <Button
                variant="secondary"
                onClick={() => setIsCityModalOpen(true)}
                className="!w-auto flex items-center gap-2 text-xs font-medium cursor-pointer font-sans shadow-2xs !px-5 !py-2.5"
              >
                <Plus size={15} /> Add another stop
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CitySearchModal 
        isOpen={isCityModalOpen} 
        onClose={() => setIsCityModalOpen(false)}
        onAdd={handleAddStop}
        trip={trip}
      />

      <ActivitySearchModal
        isOpen={!!activeStopForActivity}
        stop={activeStopForActivity}
        onClose={() => setActiveStopForActivity(null)}
        onAdd={handleAddActivity}
      />
      
      <CalendarOverlay 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        trip={{ ...trip, stops }} 
      />
      
    </div>
  );
};

export default ItineraryBuilderPage;
