import axiosInstance from './axios';
import { mockTrips, mockDestinations } from '../data/mockData';

export const getDashboardTrips = async () => {
  try {
    const response = await axiosInstance.get('/trips');
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable. Returning mock trips.");
    return mockTrips;
  }
};

export const getRecommendedDestinations = async (region = '') => {
  try {
    const params = region && region !== 'All' ? { region } : {};
    const response = await axiosInstance.get('/cities', { params });
    return response.data;
  } catch (error) {
    console.warn("Backend unavailable. Returning mock destinations.");
    if (region && region !== 'All') {
      return mockDestinations.filter(d => d.region === region);
    }
    return mockDestinations;
  }
};
