import axiosInstance from './axios';
import { mockDestinations } from '../data/mockData';
import citiesData from '../data/cities.json';
import countriesData from '../data/countries.json';

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

    return {
      trip: { id: tripId, title: 'Autumn in Europe', startDate: '2026-09-12', endDate: '2026-09-25' },
      stops: [
        {
          id: 'stop-1',
          stop_order: 1,
          city: { name: 'Paris', country: 'France' },
          startDate: '2026-09-12',
          endDate: '2026-09-15',
          activities: [
            { id: 'act-1', title: 'Louvre Museum', category: 'Culture', timeSlot: 'Morning', defaultCost: 25, scheduled_date: '2026-09-12' },
            { id: 'act-2', title: 'Seine River Cruise', category: 'Sightseeing', timeSlot: 'Afternoon', defaultCost: 18, scheduled_date: '2026-09-12' },
            { id: 'act-3', title: 'Dinner in Le Marais', category: 'Food & Dining', timeSlot: 'Evening', defaultCost: 45, scheduled_date: '2026-09-12' },
            { id: 'act-4', title: 'Eiffel Tower Tour', category: 'Sightseeing', timeSlot: 'Morning', defaultCost: 35, scheduled_date: '2026-09-13' }
          ]
        },
        {
          id: 'stop-2',
          stop_order: 2,
          city: { name: 'Rome', country: 'Italy' },
          startDate: '2026-09-15',
          endDate: '2026-09-18',
          activities: [
            { id: 'act-5', title: 'Colosseum Underground', category: 'Sightseeing', timeSlot: 'Morning', defaultCost: 40, scheduled_date: '2026-09-16' },
            { id: 'act-6', title: 'Pasta Making Class', category: 'Food & Dining', timeSlot: 'Evening', defaultCost: 85, scheduled_date: '2026-09-16' }
          ]
        }
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
    return response.data;
  } catch (error) {
    console.warn("Mocking activity search.");
    return [
      { id: 'act-1', title: 'Louvre Museum Tour', category: 'Culture', defaultCost: 25 },
      { id: 'act-2', title: 'Seine River Cruise', category: 'Sightseeing', defaultCost: 18 },
      { id: 'act-3', title: 'Pasta Making Class', category: 'Food & Dining', defaultCost: 85 },
      { id: 'act-4', title: 'Colosseum Underground', category: 'Sightseeing', defaultCost: 40 },
    ];
  }
};

export const getTrips = async () => {
  try {
    const response = await axiosInstance.get('/trips');
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable. Mocking trips.");
    const trips = [];
    
    // Load local storage trips first
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mock_trip_')) {
          trips.push(JSON.parse(localStorage.getItem(key)));
        }
      }
    } catch(e) {}
    
    // Add default mock trips
    trips.push({
      id: 'mock-trip-future',
      title: 'Autumn in Europe',
      startDate: '2026-09-12',
      endDate: '2026-09-25',
      destinations: [{}, {}, {}],
      total_budget: 5200,
      coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1000'
    });

    trips.push({
      id: 'mock-trip-past',
      title: 'Spring in Tokyo',
      startDate: '2025-03-15',
      endDate: '2025-03-25',
      destinations: [{}, {}],
      total_budget: 3500,
      coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1000'
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
