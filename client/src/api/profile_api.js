import api from './axios';

/**
 * Update the authenticated user's profile information.
 * 
 * Note: If this endpoint does not exist on the backend yet,
 * it will correctly throw an error (e.g., 404), allowing the UI to gracefully
 * handle the Error state in the modal without fabricating mock data.
 */
export const updateUserProfile = async (payload) => {
  const response = await api.put('/user/profile', payload);
  return response.data;
};
