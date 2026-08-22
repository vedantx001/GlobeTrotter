import prisma from '../config/prisma.js';

export const searchCities = async (query = {}) => {
  const {
    q,
    country,
    region,
    costIndex,
    minPopularity,
    limit = 20,
    offset = 0,
  } = query;

  const parsedLimit = parseInt(limit, 10) || 20;
  const parsedOffset = parseInt(offset, 10) || 0;

  const where = {};

  // Keyword search across name, country, region
  if (q && typeof q === 'string' && q.trim() !== '') {
    const trimmedQ = q.trim();
    where.OR = [
      { name: { contains: trimmedQ } },
      { country: { contains: trimmedQ } },
      { region: { contains: trimmedQ } },
    ];
  }

  // Country filter
  if (country && typeof country === 'string' && country.trim() !== '') {
    where.country = { equals: country.trim() };
  }

  // Region filter
  if (region && typeof region === 'string' && region.trim() !== '') {
    where.region = { equals: region.trim() };
  }

  // Cost Index filter
  if (costIndex !== undefined && costIndex !== null && costIndex !== '') {
    where.costIndex = { equals: Number(costIndex) };
  }

  // Minimum Popularity filter
  if (minPopularity !== undefined && minPopularity !== null && minPopularity !== '') {
    where.popularityScore = { gte: Number(minPopularity) };
  }

  const [total, cities] = await Promise.all([
    prisma.city.count({ where }),
    prisma.city.findMany({
      where,
      select: {
        id: true,
        name: true,
        country: true,
        region: true,
        costIndex: true,
        popularityScore: true,
        imageUrl: true,
        description: true,
      },
      orderBy: [
        { popularityScore: 'desc' },
        { name: 'asc' },
      ],
      take: parsedLimit,
      skip: parsedOffset,
    }),
  ]);

  const hasMore = parsedOffset + cities.length < total;

  return {
    cities,
    pagination: {
      limit: parsedLimit,
      offset: parsedOffset,
      total,
      hasMore,
    },
  };
};
