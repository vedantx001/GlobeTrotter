import prisma from '../utils/prisma.js';

export const getTrips = async (userId) => {
  const trips = await prisma.trip.findMany({
    where: { userId },
    orderBy: { startDate: 'desc' },
    include: { tripStops: { include: { city: true } } }
  });

  return trips.map(trip => ({
    id: trip.id,
    title: trip.title,
    description: trip.description,
    startDate: trip.startDate,
    endDate: trip.endDate,
    coverImage: trip.coverImage,
    total_budget: trip.totalBudget ? Number(trip.totalBudget) : 0,
    destinations: trip.tripStops.map(stop => ({ name: stop.city.name }))
  }));
};

export const createTrip = async (userId, data) => {
  const { 
    title, 
    description, 
    startDate, 
    start_date, 
    endDate, 
    end_date, 
    total_budget, 
    totalBudget, 
    budget, 
    coverImage, 
    cover_image 
  } = data;
  
  const rawStart = startDate || start_date;
  const rawEnd = endDate || end_date;
  const rawBudget = total_budget ?? totalBudget ?? budget ?? 0;
  const rawCover = coverImage || cover_image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=1000';

  const trip = await prisma.trip.create({
    data: {
      userId,
      title: title || 'New Journey',
      description: description || '',
      startDate: rawStart ? new Date(rawStart) : null,
      endDate: rawEnd ? new Date(rawEnd) : null,
      totalBudget: Number(rawBudget) || 0,
      coverImage: rawCover
    }
  });
  
  return { 
    id: trip.id, 
    title: trip.title, 
    startDate: trip.startDate, 
    endDate: trip.endDate,
    total_budget: Number(trip.totalBudget)
  };
};

export const getTripItinerary = async (tripId, userId) => {
  const parsedId = parseInt(tripId);
  if (isNaN(parsedId)) {
    throw new Error('Invalid trip ID');
  }

  const trip = await prisma.trip.findFirst({
    where: { id: parsedId, userId }
  });

  if (!trip) throw new Error('Trip not found');

  const stops = await prisma.tripStop.findMany({
    where: { tripId: parsedId },
    orderBy: { stopOrder: 'asc' },
    include: {
      city: true,
      itineraryActivities: {
        include: { activity: true },
        orderBy: { scheduledDate: 'asc' }
      }
    }
  });

  return {
    trip: {
      id: trip.id,
      title: trip.title,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      coverImage: trip.coverImage,
      total_budget: trip.totalBudget ? Number(trip.totalBudget) : 0
    },
    stops: stops.map(stop => ({
      id: stop.id,
      stop_order: stop.stopOrder,
      city: stop.city,
      startDate: stop.startDate,
      endDate: stop.endDate,
      notes: stop.notes,
      activities: stop.itineraryActivities.map(ia => ({
        id: ia.id,
        title: ia.activity.title,
        category: ia.activity.category,
        timeSlot: ia.timeSlot,
        defaultCost: ia.customCost ? Number(ia.customCost) : Number(ia.activity.cost),
        scheduled_date: ia.scheduledDate
      }))
    }))
  };
};

export const updateTrip = async (tripId, userId, data) => {
  const parsedId = parseInt(tripId);
  const trip = await prisma.trip.findFirst({ where: { id: parsedId, userId } });
  if (!trip) throw new Error('Trip not found');

  const { title, description, startDate, start_date, endDate, end_date, total_budget, totalBudget, budget, coverImage, cover_image } = data;
  
  const rawStart = startDate || start_date;
  const rawEnd = endDate || end_date;
  const rawBudget = total_budget ?? totalBudget ?? budget;
  const rawCover = coverImage || cover_image;

  const updated = await prisma.trip.update({
    where: { id: parsedId },
    data: {
      title: title !== undefined ? title : undefined,
      description: description !== undefined ? description : undefined,
      startDate: rawStart ? new Date(rawStart) : undefined,
      endDate: rawEnd ? new Date(rawEnd) : undefined,
      totalBudget: rawBudget !== undefined ? Number(rawBudget) : undefined,
      coverImage: rawCover !== undefined ? rawCover : undefined
    }
  });
  return updated;
};

export const deleteTrip = async (tripId, userId) => {
  const parsedId = parseInt(tripId);
  const trip = await prisma.trip.findFirst({ where: { id: parsedId, userId } });
  if (!trip) throw new Error('Trip not found');

  await prisma.trip.delete({ where: { id: parsedId } });
  return { success: true };
};

export const addTripStop = async (tripId, userId, data) => {
  const parsedTripId = parseInt(tripId);
  const trip = await prisma.trip.findFirst({ where: { id: parsedTripId, userId } });
  if (!trip) throw new Error('Trip not found');

  const { cityId, city_id, cityName, city, startDate, start_date, endDate, end_date, notes } = data;
  
  let targetCityId = parseInt(cityId || city_id);
  if (isNaN(targetCityId)) {
    const name = cityName || (typeof city === 'string' ? city : city?.name);
    if (name) {
      let foundCity = await prisma.city.findFirst({
        where: { name: { contains: name } }
      });
      if (!foundCity) {
        foundCity = await prisma.city.create({
          data: {
            name: name,
            country: data.country || 'International'
          }
        });
      }
      targetCityId = foundCity.id;
    }
  }

  // Fallback to first city if still invalid
  if (isNaN(targetCityId)) {
    const firstCity = await prisma.city.findFirst();
    if (firstCity) targetCityId = firstCity.id;
  }

  const existingStops = await prisma.tripStop.count({ where: { tripId: parsedTripId } });
  
  const rawStart = startDate || start_date;
  const rawEnd = endDate || end_date;

  const stop = await prisma.tripStop.create({
    data: {
      tripId: parsedTripId,
      cityId: targetCityId,
      stopOrder: existingStops + 1,
      startDate: rawStart ? new Date(rawStart) : null,
      endDate: rawEnd ? new Date(rawEnd) : null,
      notes: notes || null
    },
    include: { city: true }
  });
  
  return {
    id: stop.id,
    stop_order: stop.stopOrder,
    city: stop.city,
    startDate: stop.startDate,
    endDate: stop.endDate,
    notes: stop.notes,
    activities: []
  };
};

export const deleteTripStop = async (tripId, stopId, userId) => {
  const parsedTripId = parseInt(tripId);
  const parsedStopId = parseInt(stopId);
  const trip = await prisma.trip.findFirst({ where: { id: parsedTripId, userId } });
  if (!trip) throw new Error('Trip not found');

  await prisma.tripStop.delete({ where: { id: parsedStopId } });
  return { success: true };
};

export const reorderTripStops = async (tripId, userId, data) => {
  const parsedTripId = parseInt(tripId);
  const trip = await prisma.trip.findFirst({ where: { id: parsedTripId, userId } });
  if (!trip) throw new Error('Trip not found');
  
  const stops = Array.isArray(data) ? data : (data.stops || []);
  for (const stop of stops) {
    const id = parseInt(stop.stopId || stop.id);
    const order = stop.order ?? stop.stop_order ?? stop.stopOrder;
    if (!isNaN(id) && order !== undefined) {
      await prisma.tripStop.update({
        where: { id },
        data: { stopOrder: Number(order) }
      });
    }
  }
  return { success: true };
};

export const addItineraryActivity = async (stopId, userId, data) => {
  const parsedStopId = parseInt(stopId);
  const stop = await prisma.tripStop.findFirst({ 
    where: { id: parsedStopId },
    include: { trip: true, city: true }
  });
  
  if (!stop || stop.trip.userId !== userId) throw new Error('Stop not found or unauthorized');

  const { activityId, activity_id, title, category, scheduled_date, scheduledDate, timeSlot, time_slot, customCost, custom_cost } = data;
  
  let targetActivityId = parseInt(activityId || activity_id);
  if (isNaN(targetActivityId)) {
    let existingActivity = await prisma.activity.findFirst({
      where: { title: title || 'Custom Activity' }
    });
    if (!existingActivity) {
      existingActivity = await prisma.activity.create({
        data: {
          cityId: stop.cityId,
          title: title || 'Activity',
          category: category || 'Sightseeing',
          cost: (customCost ?? custom_cost) ? Number(customCost ?? custom_cost) : 0
        }
      });
    }
    targetActivityId = existingActivity.id;
  }

  const rawTimeSlot = timeSlot || time_slot || 'Morning';
  const normalizedTimeSlot = ['Morning', 'Afternoon', 'Evening'].find(s => s.toLowerCase() === rawTimeSlot.toLowerCase()) || 'Morning';
  const rawDate = scheduled_date || scheduledDate;

  const ia = await prisma.itineraryActivity.create({
    data: {
      tripStopId: parsedStopId,
      activityId: targetActivityId,
      scheduledDate: rawDate ? new Date(rawDate) : null,
      timeSlot: normalizedTimeSlot,
      customCost: (customCost !== undefined || custom_cost !== undefined) ? Number(customCost ?? custom_cost) : null
    },
    include: { activity: true }
  });
  
  return {
    id: ia.id,
    title: ia.activity.title,
    category: ia.activity.category,
    timeSlot: ia.timeSlot,
    defaultCost: ia.customCost ? Number(ia.customCost) : Number(ia.activity.cost),
    scheduled_date: ia.scheduledDate
  };
};

export const removeItineraryActivity = async (activityId, userId) => {
  const parsedActivityId = parseInt(activityId);
  const ia = await prisma.itineraryActivity.findFirst({
    where: { id: parsedActivityId },
    include: { tripStop: { include: { trip: true } } }
  });
  if (!ia || ia.tripStop.trip.userId !== userId) throw new Error('Activity not found or unauthorized');
  
  await prisma.itineraryActivity.delete({ where: { id: parsedActivityId } });
  return { success: true };
};

