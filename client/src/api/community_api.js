import api from './axios';

/**
 * Fetch the global community travel feed.
 * 
 * Note: If this endpoint does not exist on the backend yet,
 * it will correctly throw an error (e.g., 404), allowing the UI to gracefully
 * handle the Error/Retry state without fabricating mock data.
 */
export const getCommunityFeed = async () => {
  const response = await api.get('/community/feed');
  return response.data;
};

/**
 * Publish a new community experience.
 * 
 * Note: If this endpoint does not exist on the backend yet,
 * it will correctly throw an error (e.g., 404), allowing the UI to gracefully
 * handle the Error state in the modal without fabricating mock data.
 */
export const createCommunityExperience = async (payload) => {
  const response = await api.post('/community/experiences', payload);
  return response.data;
};
