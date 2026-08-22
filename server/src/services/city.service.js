import prisma from '../utils/prisma.js';

export const getCities = async (filters = {}) => {
  const { region } = filters;
  
  const where = region ? { region } : {};
  
  const cities = await prisma.city.findMany({
    where,
    orderBy: { popularityScore: 'desc' }
  });
  
  // Format to match frontend expectations
  return cities.map(city => ({
    id: city.id,
    name: city.name,
    country: city.country,
    region: city.region,
    image: city.imageUrl,
    costIndex: city.costIndex
  }));
};

export const getActivities = async (filters = {}) => {
  const { cityId, category } = filters;
  
  const where = {};
  if (cityId) where.cityId = parseInt(cityId);
  if (category) where.category = category;
  
  const activities = await prisma.activity.findMany({
    where,
    include: { city: true }
  });
  
  return activities.map(act => ({
    id: act.id,
    title: act.title,
    category: act.category,
    defaultCost: act.cost,
    durationHours: act.durationHours,
    city: act.city.name
  }));
};
