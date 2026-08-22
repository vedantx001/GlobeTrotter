import prisma from '../utils/prisma.js';

export const getCommunityFeed = async () => {
  const publicTrips = await prisma.trip.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      tripStops: {
        include: { city: true }
      }
    }
  });

  return publicTrips.map(trip => ({
    id: trip.id,
    title: trip.title,
    description: trip.description,
    destination: trip.tripStops.map(s => s.city.name).join(', '),
    createdAt: trip.createdAt,
    author: {
      name: `${trip.user.firstName} ${trip.user.lastName || ''}`.trim(),
      avatar: trip.user.profileImage
    }
  }));
};

export const createCommunityExperience = async (userId, data) => {
  const { type, referenceId, title, description } = data;
  
  if (type === 'Trip') {
    const trip = await prisma.trip.findFirst({ where: { id: parseInt(referenceId), userId } });
    if (!trip) throw new Error('Trip not found or unauthorized');

    const updated = await prisma.trip.update({
      where: { id: parseInt(referenceId) },
      data: {
        isPublic: true,
        title: title || trip.title,
        description: description || trip.description
      }
    });
    return updated;
  }
  
  throw new Error('Unsupported experience type');
};
