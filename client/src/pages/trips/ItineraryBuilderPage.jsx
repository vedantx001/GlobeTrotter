import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
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

const ItineraryBuilderPage = () => {
  const { tripId } = useParams();
  
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const data = await getTripItinerary(tripId);
        setTrip(data.trip || data);
        setStops(data.stops || []);
      } catch (err) {
        setError('Failed to load itinerary. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItinerary();
  }, [tripId]);

  const handleAddStop = async (stopPayload) => {
    // Add logic here to figure out stop_order based on existing stops
    const nextOrder = stops.length > 0 ? Math.max(...stops.map(s => s.stop_order || 0)) + 1 : 1;
    
    const payload = {
      ...stopPayload,
      stop_order: nextOrder
    };

    const newStop = await addTripStop(tripId, payload);
    setStops(prev => [...prev, newStop]);
  };

  const handleRemoveStop = async (stopId) => {
    await deleteTripStop(tripId, stopId);
    setStops(prev => prev.filter(s => s.id !== stopId));
  };

  const handleReorder = async (currentIndex, direction) => {
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= stops.length) return;

    const newStops = [...stops];
    // Swap
    const temp = newStops[currentIndex];
    newStops[currentIndex] = newStops[newIndex];
    newStops[newIndex] = temp;
    
    // Update order values sequentially
    const updatedStops = newStops.map((s, i) => ({ ...s, stop_order: i + 1 }));
    setStops(updatedStops);

    // Persist
    const payload = updatedStops.map(s => ({ stopId: s.id, order: s.stop_order }));
    try {
      await reorderTripStops(tripId, payload);
    } catch (err) {
      console.error("Reorder failed, restoring state...");
      // In a real app, restore previous state here if it fails
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
      <div className="w-full flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-20 text-secondary">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-24">
      
      <ItineraryHeader trip={trip} stops={stops} />

      <div className="mt-8">
        {stops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-warm-white border border-border-subtle rounded-[var(--radius-3xl)] text-center shadow-[var(--shadow-card)]">
            <h3 className="font-display text-(length:--text-heading-md) text-primary mb-2">
              Your journey starts here.
            </h3>
            <p className="text-(length:--text-body-sm) text-secondary max-w-md mb-8">
              Add your first destination to begin building out the itinerary timeline.
            </p>
            <Button onClick={() => setIsCityModalOpen(true)}>
              + Add a stop
            </Button>
          </div>
        ) : (
          <div className="space-y-0">
            <h3 className="font-display text-(length:--text-heading-sm) text-primary mb-8 tracking-wide">
              YOUR JOURNEY
            </h3>
            
            {stops.map((stop, index) => (
              <StopCard 
                key={stop.id}
                stop={stop}
                index={index}
                isFirst={index === 0}
                isLast={index === stops.length - 1}
                onMoveUp={() => handleReorder(index, 'up')}
                onMoveDown={() => handleReorder(index, 'down')}
                onRemove={handleRemoveStop}
                onAddActivity={() => setActiveStopForActivity(stop)}
                onRemoveActivity={handleRemoveActivity}
              />
            ))}

            <div className="pl-8 sm:pl-12 mt-8 ml-4 sm:ml-6">
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="flex items-center gap-2 text-(length:--text-body-sm) font-medium text-terracotta hover:text-primary transition-colors py-2"
              >
                <Plus size={16} />
                Add another stop
              </button>
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
      
    </div>
  );
};

export default ItineraryBuilderPage;
