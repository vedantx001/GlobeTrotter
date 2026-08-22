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
  const { cityId, category, q } = filters;
  
  const where = {};
  if (cityId) where.cityId = cityId;
  if (category) where.category = category;

  // Keyword search across title, category, and city name
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { category: { contains: q } },
      { city: { name: { contains: q } } },
    ];
  }
  
  const activities = await prisma.activity.findMany({
    where,
    include: { city: true },
    orderBy: { title: 'asc' },
  });
  
  return activities.map(act => ({
    id: act.id,
    title: act.title,
    category: act.category,
    description: act.description || '',
    defaultCost: act.cost,
    durationHours: act.durationHours,
    cityName: act.city?.name || '',
    imageUrl: act.imageUrl || null,
  }));
};
