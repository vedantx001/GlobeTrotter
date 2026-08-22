import axiosInstance from './axios';
import { mockDestinations } from '../data/mockData';

export const createTrip = async (payload) => {
  try {
    const response = await axiosInstance.post('/trips', payload);
    return response.data;
  } catch (error) {
    // DEVELOPMENT BYPASS
    console.warn("Backend unavailable. Mocking trip creation.");
    return { data: { id: `mock-trip-${Date.now()}`, ...payload } };
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
