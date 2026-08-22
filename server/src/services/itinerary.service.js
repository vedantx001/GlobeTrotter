import prisma from '../config/prisma.js';

export const getItinerary = async (userId, tripId) => {
  const parsedTripId = parseInt(tripId, 10);

  const trip = await prisma.trip.findFirst({
    where: {
      id: parsedTripId,
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
              costIndex: true,
              popularityScore: true,
              description: true,
            },
          },
          itineraryActivities: {
            orderBy: [
              { scheduledDate: 'asc' },
              { timeSlot: 'asc' },
              { id: 'asc' },
            ],
            include: {
              activity: {
                select: {
                  id: true,
                  cityId: true,
                  title: true,
                  description: true,
                  category: true,
                  cost: true,
                  durationHours: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return trip;
};

export const createStop = async (userId, tripId, stopData) => {
  const parsedTripId = parseInt(tripId, 10);
  const parsedCityId = parseInt(stopData.cityId, 10);

  // 1. Verify trip exists and belongs to user
  const trip = await prisma.trip.findFirst({
    where: { id: parsedTripId, userId },
  });

  if (!trip) {
    const err = new Error('Trip not found.');
    err.statusCode = 404;
    throw err;
  }

  // 2. Verify city exists
  const city = await prisma.city.findUnique({
    where: { id: parsedCityId },
  });

  if (!city) {
    const err = new Error('City not found.');
    err.statusCode = 404;
    throw err;
  }

  const rawStart = stopData.startDate !== undefined ? stopData.startDate : stopData.start_date;
  const rawEnd = stopData.endDate !== undefined ? stopData.endDate : stopData.end_date;

  const startDate = rawStart ? new Date(rawStart) : null;
  const endDate = rawEnd ? new Date(rawEnd) : null;

  // 3. Date boundary validations against parent trip
  if (trip.startDate && startDate && startDate < trip.startDate) {
    const err = new Error('Stop start date cannot be before trip start date.');
    err.statusCode = 400;
    throw err;
  }

  if (trip.endDate && endDate && endDate > trip.endDate) {
    const err = new Error('Stop end date cannot be after trip end date.');
    err.statusCode = 400;
    throw err;
  }

  if (trip.startDate && endDate && endDate < trip.startDate) {
    const err = new Error('Stop end date cannot be before trip start date.');
    err.statusCode = 400;
    throw err;
  }

  if (trip.endDate && startDate && startDate > trip.endDate) {
    const err = new Error('Stop start date cannot be after trip end date.');
    err.statusCode = 400;
    throw err;
  }

  // 4. Calculate stop order if not provided
  let stopOrder;
  const rawOrder = stopData.stopOrder !== undefined ? stopData.stopOrder : stopData.order;
  if (rawOrder !== undefined && Number.isInteger(Number(rawOrder))) {
    stopOrder = Number(rawOrder);
  } else {
    const lastStop = await prisma.tripStop.findFirst({
      where: { tripId: parsedTripId },
      orderBy: { stopOrder: 'desc' },
      select: { stopOrder: true },
    });
    stopOrder = lastStop ? lastStop.stopOrder + 1 : 0;
  }

  const newStop = await prisma.tripStop.create({
    data: {
      tripId: parsedTripId,
      cityId: parsedCityId,
      stopOrder,
      startDate,
      endDate,
      notes: stopData.notes ? stopData.notes.trim() : null,
    },
    include: {
      city: true,
      itineraryActivities: true,
    },
  });

  return newStop;
};

export const updateStop = async (userId, tripId, stopId, updateData) => {
  const parsedTripId = parseInt(tripId, 10);
  const parsedStopId = parseInt(stopId, 10);

  // 1. Verify trip exists and belongs to user
  const trip = await prisma.trip.findFirst({
    where: { id: parsedTripId, userId },
  });

  if (!trip) {
    const err = new Error('Trip not found.');
    err.statusCode = 404;
    throw err;
  }

  // 2. Verify stop exists and belongs to trip
  const existingStop = await prisma.tripStop.findFirst({
    where: { id: parsedStopId, tripId: parsedTripId },
  });

  if (!existingStop) {
    const err = new Error('Trip stop not found.');
    err.statusCode = 404;
    throw err;
  }

  const rawStart = updateData.startDate !== undefined ? updateData.startDate : updateData.start_date;
  const rawEnd = updateData.endDate !== undefined ? updateData.endDate : updateData.end_date;

  const effectiveStart = rawStart !== undefined ? (rawStart ? new Date(rawStart) : null) : existingStop.startDate;
  const effectiveEnd = rawEnd !== undefined ? (rawEnd ? new Date(rawEnd) : null) : existingStop.endDate;

  if (effectiveStart && effectiveEnd && effectiveEnd < effectiveStart) {
    const err = new Error('End date must be greater than or equal to start date.');
    err.statusCode = 400;
    throw err;
  }

  // 3. Date boundary validations against parent trip
  if (trip.startDate && effectiveStart && effectiveStart < trip.startDate) {
    const err = new Error('Stop start date cannot be before trip start date.');
    err.statusCode = 400;
    throw err;
  }

  if (trip.endDate && effectiveEnd && effectiveEnd > trip.endDate) {
    const err = new Error('Stop end date cannot be after trip end date.');
    err.statusCode = 400;
    throw err;
  }

  const dataToUpdate = {};
  if (rawStart !== undefined) dataToUpdate.startDate = effectiveStart;
  if (rawEnd !== undefined) dataToUpdate.endDate = effectiveEnd;
  if (updateData.notes !== undefined) dataToUpdate.notes = updateData.notes ? updateData.notes.trim() : null;
  if (updateData.cityId !== undefined) {
    const city = await prisma.city.findUnique({ where: { id: parseInt(updateData.cityId, 10) } });
    if (!city) {
      const err = new Error('City not found.');
      err.statusCode = 404;
      throw err;
    }
    dataToUpdate.cityId = parseInt(updateData.cityId, 10);
  }

  const updatedStop = await prisma.tripStop.update({
    where: { id: parsedStopId },
    data: dataToUpdate,
    include: {
      city: true,
      itineraryActivities: true,
    },
  });

  return updatedStop;
};

export const deleteStop = async (userId, tripId, stopId) => {
  const parsedTripId = parseInt(tripId, 10);
  const parsedStopId = parseInt(stopId, 10);

  const trip = await prisma.trip.findFirst({
    where: { id: parsedTripId, userId },
  });

  if (!trip) {
    const err = new Error('Trip not found.');
    err.statusCode = 404;
    throw err;
  }

  const stop = await prisma.tripStop.findFirst({
    where: { id: parsedStopId, tripId: parsedTripId },
  });

  if (!stop) {
    const err = new Error('Trip stop not found.');
    err.statusCode = 404;
    throw err;
  }

  await prisma.tripStop.delete({
    where: { id: parsedStopId },
  });

  return true;
};

export const reorderStops = async (userId, tripId, stopsArray) => {
  const parsedTripId = parseInt(tripId, 10);

  const trip = await prisma.trip.findFirst({
    where: { id: parsedTripId, userId },
  });

  if (!trip) {
    const err = new Error('Trip not found.');
    err.statusCode = 404;
    throw err;
  }

  const existingStops = await prisma.tripStop.findMany({
    where: { tripId: parsedTripId },
  });

  const existingStopMap = new Map(existingStops.map((s) => [s.id, s]));

  for (const item of stopsArray) {
    const sId = item.stopId !== undefined ? Number(item.stopId) : Number(item.stop_id);
    if (!existingStopMap.has(sId)) {
      const err = new Error(`Stop ${sId} does not belong to this trip.`);
      err.statusCode = 400;
      throw err;
    }
  }

  const updates = stopsArray.map((item) => {
    const sId = item.stopId !== undefined ? Number(item.stopId) : Number(item.stop_id);
    const sOrder = item.order !== undefined ? Number(item.order) : Number(item.stopOrder);
    return prisma.tripStop.update({
      where: { id: sId },
      data: { stopOrder: sOrder },
    });
  });

  await prisma.$transaction(updates);

  const updatedStops = await prisma.tripStop.findMany({
    where: { tripId: parsedTripId },
    orderBy: { stopOrder: 'asc' },
    include: {
      city: true,
      itineraryActivities: true,
    },
  });

  return updatedStops;
};

export const assignActivity = async (userId, stopId, activityData) => {
  const parsedStopId = parseInt(stopId, 10);

  // 1. Verify trip stop exists and user owns the trip
  const tripStop = await prisma.tripStop.findUnique({
    where: { id: parsedStopId },
    include: {
      trip: true,
      city: true,
    },
  });

  if (!tripStop || tripStop.trip.userId !== userId) {
    const err = new Error('Trip stop not found.');
    err.statusCode = 404;
    throw err;
  }

  // 2. Verify referenced activity exists
  const rawActivityId = activityData.activityId !== undefined ? activityData.activityId : activityData.activity_id;
  const parsedActivityId = parseInt(rawActivityId, 10);

  const activity = await prisma.activity.findUnique({
    where: { id: parsedActivityId },
  });

  if (!activity) {
    const err = new Error('Activity not found.');
    err.statusCode = 404;
    throw err;
  }

  // 3. City Consistency Rule: activity.cityId === tripStop.cityId
  if (activity.cityId !== tripStop.cityId) {
    const err = new Error('Activity must belong to the same city as the trip stop.');
    err.statusCode = 400;
    throw err;
  }

  // 4. Scheduled Date Rule: inside stop dates
  const rawDate = activityData.scheduledDate !== undefined ? activityData.scheduledDate : activityData.scheduled_date;
  let scheduledDate = null;
  if (rawDate) {
    scheduledDate = new Date(rawDate);
    if (tripStop.startDate && scheduledDate < tripStop.startDate) {
      const err = new Error('Scheduled date cannot be before the stop start date.');
      err.statusCode = 400;
      throw err;
    }
    if (tripStop.endDate && scheduledDate > tripStop.endDate) {
      const err = new Error('Scheduled date cannot be after the stop end date.');
      err.statusCode = 400;
      throw err;
    }
  }

  const rawSlot = activityData.timeSlot !== undefined ? activityData.timeSlot : activityData.time_slot;
  const rawCost = activityData.customCost !== undefined ? activityData.customCost : activityData.custom_cost;

  const newAssignment = await prisma.itineraryActivity.create({
    data: {
      tripStopId: parsedStopId,
      activityId: parsedActivityId,
      scheduledDate,
      timeSlot: rawSlot || null,
      customCost: rawCost !== undefined && rawCost !== null && rawCost !== '' ? Number(rawCost) : null,
      notes: activityData.notes ? activityData.notes.trim() : null,
    },
    include: {
      activity: true,
    },
  });

  return newAssignment;
};

export const deleteItineraryActivity = async (userId, itineraryActivityId) => {
  const parsedId = parseInt(itineraryActivityId, 10);

  const itineraryActivity = await prisma.itineraryActivity.findUnique({
    where: { id: parsedId },
    include: {
      tripStop: {
        include: {
          trip: true,
        },
      },
    },
  });

  if (!itineraryActivity || itineraryActivity.tripStop.trip.userId !== userId) {
    const err = new Error('Itinerary activity not found.');
    err.statusCode = 404;
    throw err;
  }

  await prisma.itineraryActivity.delete({
    where: { id: parsedId },
  });

  return true;
};
