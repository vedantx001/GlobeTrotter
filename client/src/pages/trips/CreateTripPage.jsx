import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TripForm from '../../components/trips/TripForm';
import TripSuggestionCard from '../../components/trips/TripSuggestionCard';
import { getTripSuggestions } from '../../api/trips_api';

const CreateTripPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [presetDestination, setPresetDestination] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoadingSuggestions(true);
        const data = await getTripSuggestions();
        const dataArray = data?.data || data?.cities || data || [];
        setSuggestions(Array.isArray(dataArray) ? dataArray : []);
      } catch (err) {
        // Silent failure for suggestions is fine, empty state handles it
        console.warn('Could not load suggestions');
      } finally {
        setLoadingSuggestions(false);
      }
    };
    
    fetchSuggestions();
  }, []);

  const handleUseSuggestion = (destinationName) => {
    setPresetDestination(destinationName);
    // Scroll to top smoothly so user sees form changed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full pb-16">
      {/* Back navigation */}
      <div className="mb-8">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-(length:--text-body-sm) text-secondary hover:text-primary font-medium transition-colors"
        >
          ← Back to dashboard
        </Link>
      </div>

      {/* Editorial Header */}
      <div className="mb-10 lg:mb-16">
        <h1 className="font-display text-(length:--text-heading-lg) text-primary leading-none mb-3">
          Create a new journey.
        </h1>
        <p className="text-(length:--text-body-lg) text-secondary max-w-xl">
          Give your trip a shape before filling in the details. You can always adjust dates and destinations later.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Main Form Zone */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="bg-warm-white border border-border-subtle rounded-[var(--radius-3xl)] p-6 sm:p-10 shadow-[var(--shadow-card)]">
            <TripForm presetDestination={presetDestination} />
          </div>
        </div>

        {/* Suggestions Zone (Side or Bottom) */}
        <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0">
          <div className="sticky top-24">
            <h3 className="font-display text-(length:--text-heading-sm) text-primary mb-2">
              Destination Inspiration
            </h3>
            <p className="text-(length:--text-body-sm) text-secondary mb-6">
              Where could this journey take you?
            </p>

            {loadingSuggestions ? (
              <div className="flex overflow-x-auto lg:flex-col gap-4 pb-4 lg:pb-0 hide-scrollbar">
                {[1, 2].map(i => (
                  <div key={i} className="h-56 min-w-[200px] lg:w-full bg-surface-muted rounded-[var(--radius-2xl)] animate-pulse flex-shrink-0" />
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="flex overflow-x-auto lg:flex-col gap-4 pb-4 lg:pb-0 hide-scrollbar">
                {suggestions.map((suggestion, idx) => (
                  <TripSuggestionCard 
                    key={suggestion.id || suggestion._id || idx} 
                    suggestion={suggestion} 
                    onUse={handleUseSuggestion}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 border border-border-subtle rounded-[var(--radius-2xl)] bg-warm-white text-center">
                <p className="text-secondary text-(length:--text-body-sm)">
                  No suggestions available right now.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateTripPage;
