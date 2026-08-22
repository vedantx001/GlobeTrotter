import prisma from '../config/prisma.js';

export const getUserTrips = async (userId) => {
  const trips = await prisma.trip.findMany({
    where: { userId },
    orderBy: [
      { startDate: 'asc' },
      { createdAt: 'desc' },
    ],
    include: {
      _count: {
        select: {
          tripStops: true,
        },
      },
    },
  });

  return trips.map((trip) => {
    const { _count, ...rest } = trip;
    const count = _count?.tripStops || 0;
    return {
      ...rest,
      destinationCount: count,
      destination_count: count,
    };
  });
};

export const createTrip = async (userId, tripData) => {
  const {
    title,
    description,
    startDate,
    start_date,
    endDate,
    end_date,
    coverImage,
    cover_image,
    totalBudget,
    total_budget,
  } = tripData;

  const rawStartDate = startDate !== undefined ? startDate : start_date;
  const rawEndDate = endDate !== undefined ? endDate : end_date;
  const rawCoverImage = coverImage !== undefined ? coverImage : cover_image;
  const rawBudget = totalBudget !== undefined ? totalBudget : total_budget;

  const createdTrip = await prisma.trip.create({
    data: {
      userId,
      title: title.trim(),
      description: description !== undefined ? description : null,
      startDate: rawStartDate ? new Date(rawStartDate) : null,
      endDate: rawEndDate ? new Date(rawEndDate) : null,
      coverImage: rawCoverImage || null,
      totalBudget: rawBudget !== undefined && rawBudget !== null ? Number(rawBudget) : null,
    },
  });

  return {
    ...createdTrip,
    destinationCount: 0,
    destination_count: 0,
  };
};

export const getTripById = async (userId, tripId) => {
  const parsedId = parseInt(tripId, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    return null;
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: parsedId,
      userId,
    },
    include: {
      tripStops: {
        orderBy: { stopOrder: 'asc' },
        include: {
          city: {
            select: {
              id: true,
              name: true,
              country: true,
              region: true,
              imageUrl: true,
            },
          },
        },
      },
      _count: {
        select: {
          tripStops: true,
          tripExpenses: true,
        },
      },
    },
  });

  if (!trip) {
    return null;
  }

  const { _count, ...rest } = trip;
  const count = _count?.tripStops || 0;

  return {
    ...rest,
    destinationCount: count,
    destination_count: count,
  };
};

export const updateTrip = async (userId, tripId, updateData) => {
  const parsedId = parseInt(tripId, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    return null;
  }

  // 1. Verify existence & ownership
  const existingTrip = await prisma.trip.findFirst({
    where: {
      id: parsedId,
      userId,
    },
  });

  if (!existingTrip) {
    return null;
  }

  // 2. Cross-validate dates against existing trip state for partial updates
  let newStartDate = existingTrip.startDate;
  let newEndDate = existingTrip.endDate;

  const rawStartDate = updateData.startDate !== undefined ? updateData.startDate : updateData.start_date;
  const rawEndDate = updateData.endDate !== undefined ? updateData.endDate : updateData.end_date;

  if (rawStartDate !== undefined) {
    newStartDate = rawStartDate ? new Date(rawStartDate) : null;
  }
  if (rawEndDate !== undefined) {
    newEndDate = rawEndDate ? new Date(rawEndDate) : null;
  }

  if (newStartDate && newEndDate && newEndDate < newStartDate) {
    const error = new Error('End date must be greater than or equal to start date.');
    error.statusCode = 400;
    throw error;
  }

  // 3. Build update payload with only provided fields
  const dataToUpdate = {};
  if (updateData.title !== undefined) {
    dataToUpdate.title = updateData.title.trim();
  }
  if (updateData.description !== undefined) {
    dataToUpdate.description = updateData.description;
  }
  if (rawStartDate !== undefined) {
    dataToUpdate.startDate = newStartDate;
  }
  if (rawEndDate !== undefined) {
    dataToUpdate.endDate = newEndDate;
  }
  if (updateData.coverImage !== undefined || updateData.cover_image !== undefined) {
    dataToUpdate.coverImage = updateData.coverImage !== undefined ? updateData.coverImage : updateData.cover_image;
  }
  const rawBudget = updateData.totalBudget !== undefined ? updateData.totalBudget : updateData.total_budget;
  if (rawBudget !== undefined) {
    dataToUpdate.totalBudget = rawBudget !== null ? Number(rawBudget) : null;
  }

  const updatedTrip = await prisma.trip.update({
    where: { id: parsedId },
    data: dataToUpdate,
    include: {
      _count: {
        select: {
          tripStops: true,
        },
      },
    },
  });

  const { _count, ...rest } = updatedTrip;
  const count = _count?.tripStops || 0;

  return {
    ...rest,
    destinationCount: count,
    destination_count: count,
  };
};

export const deleteTrip = async (userId, tripId) => {
  const parsedId = parseInt(tripId, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    return false;
  }

  const existingTrip = await prisma.trip.findFirst({
    where: {
      id: parsedId,
      userId,
    },
  });

  if (!existingTrip) {
    return false;
  }

  await prisma.trip.delete({
    where: { id: parsedId },
  });

  return true;
};
