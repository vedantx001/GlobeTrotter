import axiosInstance from './axios';
import { mockDestinations } from '../data/mockData';
import citiesData from '../data/cities.json';
import countriesData from '../data/countries.json';
import activityPlacesData from '../data/activity_places.json';
import activitiesData from '../data/activities.json';

// Pre-compute a flat, denormalised activity list from the local JSON datasets
// (mirrors what explore_utils.js does, used as fallback for searchActivities)
const _activityMap = new Map(activitiesData.map(a => [a.id, a]));
const _cityMap = new Map(citiesData.map(c => [c.id, c]));
const flatActivitiesFallback = activityPlacesData.map(place => {
  const act = _activityMap.get(place.activityId) || {};
  const city = _cityMap.get(place.cityId) || {};
  return {
    id: place.id,
    title: place.name,
    category: act.category || 'General',
    description: place.description || act.description || '',
    defaultCost: place.estimatedCost ?? act.defaultCost ?? 0,
    durationHours: place.durationHours ?? act.durationHours ?? 1,
    rating: place.rating ?? null,
    cityName: city.name || '',
    tags: [...(place.tags || []), ...(act.tags || [])],
  };
});

export const createTrip = async (payload) => {
  try {
    const response = await axiosInstance.post('/trips', payload);
    return response.data;
  } catch (error) {
    // DEVELOPMENT BYPASS
    console.warn("Backend unavailable. Mocking trip creation.");
    const mockTrip = { id: `mock-trip-${Date.now()}`, ...payload };
    // Save to localStorage so Itinerary Builder can load it
    try { localStorage.setItem(`mock_trip_${mockTrip.id}`, JSON.stringify(mockTrip)); } catch(e){}
    return { data: mockTrip };
  }
};

export const getTripSuggestions = async () => {
  try {
    const response = await axiosInstance.get('/cities');
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable. Returning JSON dataset destinations.");
    const countryMap = new Map(countriesData.map(c => [c.id, c.name]));
    return citiesData.map(city => ({
      ...city,
      country: countryMap.get(city.countryId) || city.region || 'International',
      image: city.imageUrl || mockDestinations.find(m => m.name.toLowerCase() === city.name.toLowerCase())?.image || null
    }));
  }
};

export const getTripItinerary = async (tripId) => {
  try {
    const response = await axiosInstance.get(`/trips/${tripId}/itinerary`);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable. Mocking itinerary load.");
    
    // Try to load from localStorage if created during this session
    try {
      const saved = localStorage.getItem(`mock_trip_${tripId}`);
      if (saved) {
        return {
          trip: JSON.parse(saved),
          stops: []
        };
      }
    } catch(e) {}

    // Default: Alex's European Grand Tour itinerary
    return {
      trip: { id: tripId, title: 'European Grand Tour 2026', startDate: '2026-09-10', endDate: '2026-09-24', total_budget: 3500 },
      stops: [
        {
          id: 'stop-1',
          stop_order: 1,
          city: { name: 'London', country: 'United Kingdom' },
          startDate: '2026-09-10',
          endDate: '2026-09-14',
          notes: 'Stay at Covent Garden boutique hotel; explore historic sights and theatres.',
          activities: [
            { id: 'act-1', title: 'Tower of London & Crown Jewels', category: 'Sightseeing', timeSlot: 'Morning', defaultCost: 42, scheduled_date: '2026-09-11', notes: 'Arrive early before crowds.' },
            { id: 'act-2', title: 'Thames River Kayaking Expedition', category: 'Adventure', timeSlot: 'Afternoon', defaultCost: 55, scheduled_date: '2026-09-12', notes: 'Booked with group discount.' },
            { id: 'act-3', title: 'West End Historic Pub Crawl', category: 'Food & Dining', timeSlot: 'Evening', defaultCost: 38, scheduled_date: '2026-09-13', notes: 'Historic pub crawl through Soho.' },
          ]
        },
        {
          id: 'stop-2',
          stop_order: 2,
          city: { name: 'Paris', country: 'France' },
          startDate: '2026-09-14',
          endDate: '2026-09-19',
          notes: 'Eurostar from London St Pancras to Gare du Nord. Apartment in Le Marais.',
          activities: [
            { id: 'act-4', title: 'Eiffel Tower Summit & Champagne', category: 'Sightseeing', timeSlot: 'Morning', defaultCost: 45, scheduled_date: '2026-09-15', notes: 'Summit elevator tickets reserved.' },
            { id: 'act-5', title: 'Louvre Museum Masterpieces Tour', category: 'Culture', timeSlot: 'Afternoon', defaultCost: 65, scheduled_date: '2026-09-16', notes: 'Meet guide under the Pyramid.' },
            { id: 'act-6', title: 'Seine River Sunset Dinner Cruise', category: 'Food & Dining', timeSlot: 'Evening', defaultCost: 95, scheduled_date: '2026-09-17', notes: 'Special window table reservation.' },
          ]
        },
        {
          id: 'stop-3',
          stop_order: 3,
          city: { name: 'Amsterdam', country: 'Netherlands' },
          startDate: '2026-09-19',
          endDate: '2026-09-24',
          notes: 'Thalys train from Paris to Amsterdam Centraal. Canal side stay.',
          activities: [
            { id: 'act-7', title: 'Historic Canal Ring Boat Cruise', category: 'Relaxation', timeSlot: 'Morning', defaultCost: 28, scheduled_date: '2026-09-20', notes: 'Morning light cruise.' },
            { id: 'act-8', title: 'Van Gogh Museum Masterpiece Tour', category: 'Culture', timeSlot: 'Afternoon', defaultCost: 35, scheduled_date: '2026-09-21', notes: 'Audio guide included.' },
            { id: 'act-9', title: 'Dutch Countryside Windmills Bike Tour', category: 'Adventure', timeSlot: 'Morning', defaultCost: 50, scheduled_date: '2026-09-22', notes: 'Rental bikes provided at hotel.' },
          ]
        },
      ]
    };
  }
};

export const addTripStop = async (tripId, payload) => {
  try {
    const response = await axiosInstance.post(`/trips/${tripId}/stops`, payload);
    return response.data;
  } catch (error) {
    console.warn("Mocking stop creation.");
    return { id: `stop-${Date.now()}`, ...payload, activities: [] };
  }
};

export const deleteTripStop = async (tripId, stopId) => {
  try {
    const response = await axiosInstance.delete(`/trips/${tripId}/stops/${stopId}`);
    return response.data;
  } catch (error) {
    console.warn("Mocking stop deletion.");
    return { success: true };
  }
};

export const reorderTripStops = async (tripId, stopsPayload) => {
  try {
    const response = await axiosInstance.put(`/trips/${tripId}/stops/reorder`, stopsPayload);
    return response.data;
  } catch (error) {
    console.warn("Mocking stop reorder.");
    return { success: true };
  }
};

export const addActivityToStop = async (stopId, payload) => {
  try {
    const response = await axiosInstance.post(`/trips/stops/${stopId}/activities`, payload);
    return response.data;
  } catch (error) {
    console.warn("Mocking activity creation.");
    return { id: `act-${Date.now()}`, ...payload };
  }
};

export const removeItineraryActivity = async (activityId) => {
  try {
    const response = await axiosInstance.delete(`/trips/activities/${activityId}`);
    return response.data;
  } catch (error) {
    console.warn("Mocking activity deletion.");
    return { success: true };
  }
};

export const searchActivities = async (params) => {
  try {
    const response = await axiosInstance.get('/activities', { params });
    // Backend wraps all responses: { success: true, data: [...] }
    // So response.data = { success, data: [...] }, the array is at response.data.data
    const activities = response.data?.data || response.data;
    if (Array.isArray(activities) && activities.length > 0) {
      return activities;
    }
    // Backend returned empty — fall through to local JSON fallback
    throw new Error('Empty response from backend, using local data.');
  } catch (error) {
    console.warn("Backend unavailable or empty. Using activity_places.json as fallback.");
    // Filter by search query if provided
    const q = (params?.q || '').toLowerCase().trim();
    if (q) {
      return flatActivitiesFallback.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.cityName.toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return flatActivitiesFallback;
  }
};

export const getTrips = async () => {
  try {
    const response = await axiosInstance.get('/trips');
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable. Mocking trips for presentation.");
    const trips = [];
    
    // Load local storage trips first (created during this session)
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mock_trip_')) {
          trips.push(JSON.parse(localStorage.getItem(key)));
        }
      }
    } catch(e) {}
    
    // Alex's presentation trips as default fallback
    trips.push({
      id: 'alex-trip-1',
      title: 'European Grand Tour 2026',
      startDate: '2026-09-10',
      endDate: '2026-09-24',
      destinations: [
        { name: 'London' }, { name: 'Paris' }, { name: 'Amsterdam' }
      ],
      total_budget: 3500,
      isPublic: true,
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
    });

    trips.push({
      id: 'alex-trip-2',
      title: 'Asia Wishlist: Tokyo & Kyoto',
      startDate: '2025-11-05',
      endDate: '2025-11-15',
      destinations: [{ name: 'Tokyo' }, { name: 'Kyoto' }],
      total_budget: 2800,
      isPublic: false,
      coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'
    });

    trips.push({
      id: 'alex-trip-3',
      title: 'Bali Serenity Retreat',
      startDate: '2026-12-20',
      endDate: '2026-12-30',
      destinations: [{ name: 'Bali' }],
      total_budget: 1800,
      isPublic: true,
      coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
    });
    
    // Deduplicate by ID
    const uniqueTrips = Array.from(new Map(trips.map(item => [item.id, item])).values());
    // Sort newest to oldest
    return uniqueTrips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }
};

export const updateTrip = async (tripId, payload) => {
  try {
    const response = await axiosInstance.put(`/trips/${tripId}`, payload);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable. Mocking trip update.");
    try {
      const savedKey = `mock_trip_${tripId}`;
      const existing = localStorage.getItem(savedKey);
      const updatedData = existing ? { ...JSON.parse(existing), ...payload } : { id: tripId, ...payload };
      localStorage.setItem(savedKey, JSON.stringify(updatedData));
      return { data: updatedData };
    } catch (e) {
      return { data: { id: tripId, ...payload } };
    }
  }
};

export const deleteTrip = async (tripId) => {
  try {
    const response = await axiosInstance.delete(`/trips/${tripId}`);
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable. Mocking trip deletion.");
    try { localStorage.removeItem(`mock_trip_${tripId}`); } catch(e) {}
    return { success: true };
  }
};
