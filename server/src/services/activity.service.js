import prisma from '../config/prisma.js';

export const searchActivities = async (queryParams = {}) => {
  const {
    cityId,
    q,
    category,
    minCost,
    maxCost,
    minDuration,
    maxDuration,
    limit,
    offset,
  } = queryParams;

  const parsedLimit = limit !== undefined && limit !== '' ? parseInt(limit, 10) : 20;
  const parsedOffset = offset !== undefined && offset !== '' ? parseInt(offset, 10) : 0;

  const where = {};

  // Keyword search (title or description)
  if (q && typeof q === 'string' && q.trim() !== '') {
    const trimmedQ = q.trim();
    where.OR = [
      { title: { contains: trimmedQ } },
      { description: { contains: trimmedQ } },
    ];
  }

  // City ID filter
  if (cityId !== undefined && cityId !== '') {
    where.cityId = parseInt(cityId, 10);
  }

  // Category filter
  if (category !== undefined && category !== '') {
    where.category = category;
  }

  // Cost range filter
  const costFilter = {};
  if (minCost !== undefined && minCost !== '') {
    costFilter.gte = Number(minCost);
  }
  if (maxCost !== undefined && maxCost !== '') {
    costFilter.lte = Number(maxCost);
  }
  if (Object.keys(costFilter).length > 0) {
    where.cost = costFilter;
  }

  // Duration range filter
  const durationFilter = {};
  if (minDuration !== undefined && minDuration !== '') {
    durationFilter.gte = Number(minDuration);
  }
  if (maxDuration !== undefined && maxDuration !== '') {
    durationFilter.lte = Number(maxDuration);
  }
  if (Object.keys(durationFilter).length > 0) {
    where.durationHours = durationFilter;
  }

  // Perform count and retrieval queries concurrently
  const [total, activities] = await Promise.all([
    prisma.activity.count({ where }),
    prisma.activity.findMany({
      where,
      select: {
        id: true,
        cityId: true,
        title: true,
        description: true,
        category: true,
        cost: true,
        durationHours: true,
        imageUrl: true,
        city: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
      },
      orderBy: [
        { title: 'asc' },
        { id: 'asc' },
      ],
      take: parsedLimit,
      skip: parsedOffset,
    }),
  ]);

  return {
    activities,
    pagination: {
      limit: parsedLimit,
      offset: parsedOffset,
      total,
      hasMore: parsedOffset + activities.length < total,
    },
  };
};
