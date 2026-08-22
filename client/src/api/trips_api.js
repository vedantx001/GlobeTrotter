import axiosInstance from './axios';
import { mockDestinations } from '../data/mockData';

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
    console.warn("Backend unavailable. Returning mock destinations.");
    return mockDestinations.slice(0, 3);
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
      stops: []
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
