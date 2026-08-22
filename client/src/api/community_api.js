import api from './axios';
import communityExperiences from '../data/community_experiences.json';

// Normalise the static JSON into the shape the CommunityPost component expects
const normalisedMockFeed = communityExperiences.map((exp) => ({
  id: exp.id,
  title: exp.title,
  description: exp.content,
  destination: exp.cityId?.replace('city_', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Global',
  author: {
    name: exp.user?.name || 'Anonymous',
    avatarUrl: exp.user?.avatarUrl || null,
  },
  tripName: exp.tripTitle,
  likes: exp.likes || 0,
  createdAt: exp.createdAt,
}));

/**
 * Fetch the global community travel feed.
 * Falls back to local static data if the backend endpoint is unavailable.
 */
export const getCommunityFeed = async () => {
  try {
    const response = await api.get('/community/feed');
    return response.data;
  } catch (error) {
    console.warn('Community feed endpoint unavailable. Using mock data for presentation.');
    return normalisedMockFeed;
  }
};

/**
 * Publish a new community experience.
 * Falls back gracefully if the backend endpoint is unavailable.
 */
export const createCommunityExperience = async (payload) => {
  try {
    const response = await api.post('/community/experiences', payload);
    return response.data;
  } catch (error) {
    console.warn('Community experience creation endpoint unavailable. Mocking success.');
    return { id: `mock-exp-${Date.now()}`, ...payload, createdAt: new Date().toISOString(), likes: 0 };
  }
};
