import { errorResponse } from '../utils/response.js';

const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

const isPositiveInteger = (val) => {
  const num = Number(val);
  return Number.isInteger(num) && num > 0;
};

const isNonNegativeInteger = (val) => {
  const num = Number(val);
  return Number.isInteger(num) && num >= 0;
};

export const validateTripId = (req, res, next) => {
  const { tripId } = req.params;
  if (!isPositiveInteger(tripId)) {
    return errorResponse(res, 400, 'Valid tripId is required.');
  }
  next();
};

export const validateCreateStop = (req, res, next) => {
  const { tripId } = req.params;
  const { cityId, startDate, start_date, endDate, end_date } = req.body;

  if (!isPositiveInteger(tripId)) {
    return errorResponse(res, 400, 'Valid tripId is required.');
  }

  if (!isPositiveInteger(cityId)) {
    return errorResponse(res, 400, 'Valid cityId is required.');
  }

  const rawStart = startDate !== undefined ? startDate : start_date;
  const rawEnd = endDate !== undefined ? endDate : end_date;

  if (rawStart !== undefined && rawStart !== null) {
    if (!isValidDate(rawStart)) {
      return errorResponse(res, 400, 'Invalid start date format.');
    }
  }

  if (rawEnd !== undefined && rawEnd !== null) {
    if (!isValidDate(rawEnd)) {
      return errorResponse(res, 400, 'Invalid end date format.');
    }
  }

  if (rawStart && rawEnd) {
    if (new Date(rawEnd) < new Date(rawStart)) {
      return errorResponse(res, 400, 'End date must be greater than or equal to start date.');
    }
  }

  next();
};

export const validateUpdateStop = (req, res, next) => {
  const { tripId, stopId } = req.params;
  const { startDate, start_date, endDate, end_date } = req.body;

  if (!isPositiveInteger(tripId)) {
    return errorResponse(res, 400, 'Valid tripId is required.');
  }

  if (!isPositiveInteger(stopId)) {
    return errorResponse(res, 400, 'Valid stopId is required.');
  }

  const rawStart = startDate !== undefined ? startDate : start_date;
  const rawEnd = endDate !== undefined ? endDate : end_date;

  if (rawStart !== undefined && rawStart !== null) {
    if (!isValidDate(rawStart)) {
      return errorResponse(res, 400, 'Invalid start date format.');
    }
  }

  if (rawEnd !== undefined && rawEnd !== null) {
    if (!isValidDate(rawEnd)) {
      return errorResponse(res, 400, 'Invalid end date format.');
    }
  }

  if (rawStart && rawEnd) {
    if (new Date(rawEnd) < new Date(rawStart)) {
      return errorResponse(res, 400, 'End date must be greater than or equal to start date.');
    }
  }

  next();
};

export const validateDeleteStop = (req, res, next) => {
  const { tripId, stopId } = req.params;

  if (!isPositiveInteger(tripId)) {
    return errorResponse(res, 400, 'Valid tripId is required.');
  }

  if (!isPositiveInteger(stopId)) {
    return errorResponse(res, 400, 'Valid stopId is required.');
  }

  next();
};

export const validateReorderStops = (req, res, next) => {
  const { tripId } = req.params;
  const { stops } = req.body;

  if (!isPositiveInteger(tripId)) {
    return errorResponse(res, 400, 'Valid tripId is required.');
  }

  if (!Array.isArray(stops) || stops.length === 0) {
    return errorResponse(res, 400, 'stops must be a non-empty array.');
  }

  const seenStopIds = new Set();
  const seenOrders = new Set();

  for (const item of stops) {
    if (!item || typeof item !== 'object') {
      return errorResponse(res, 400, 'Each stop item must be an object with stopId and order.');
    }

    const stopId = item.stopId !== undefined ? item.stopId : item.stop_id;
    const order = item.order !== undefined ? item.order : item.stopOrder;

    if (!isPositiveInteger(stopId)) {
      return errorResponse(res, 400, 'Each item must have a valid positive integer stopId.');
    }

    if (!isNonNegativeInteger(order)) {
      return errorResponse(res, 400, 'Each item must have a valid non-negative integer order.');
    }

    if (seenStopIds.has(stopId)) {
      return errorResponse(res, 400, `Duplicate stopId detected: ${stopId}`);
    }
    seenStopIds.add(stopId);

    if (seenOrders.has(order)) {
      return errorResponse(res, 400, `Duplicate order value detected: ${order}`);
    }
    seenOrders.add(order);
  }

  next();
};

export const validateAssignActivity = (req, res, next) => {
  const { stopId } = req.params;
  const {
    activityId,
    activity_id,
    scheduledDate,
    scheduled_date,
    timeSlot,
    time_slot,
    customCost,
    custom_cost,
  } = req.body;

  if (!isPositiveInteger(stopId)) {
    return errorResponse(res, 400, 'Valid stopId is required.');
  }

  const rawActivityId = activityId !== undefined ? activityId : activity_id;
  if (!isPositiveInteger(rawActivityId)) {
    return errorResponse(res, 400, 'Valid activityId is required.');
  }

  const rawDate = scheduledDate !== undefined ? scheduledDate : scheduled_date;
  if (rawDate !== undefined && rawDate !== null) {
    if (!isValidDate(rawDate)) {
      return errorResponse(res, 400, 'Invalid scheduledDate format.');
    }
  }

  const rawSlot = timeSlot !== undefined ? timeSlot : time_slot;
  if (rawSlot !== undefined && rawSlot !== null && rawSlot !== '') {
    const validSlots = ['Morning', 'Afternoon', 'Evening'];
    if (!validSlots.includes(rawSlot)) {
      return errorResponse(res, 400, 'Invalid timeSlot. Must be Morning, Afternoon, or Evening.');
    }
  }

  const rawCost = customCost !== undefined ? customCost : custom_cost;
  if (rawCost !== undefined && rawCost !== null && rawCost !== '') {
    const costNum = Number(rawCost);
    if (isNaN(costNum) || costNum < 0) {
      return errorResponse(res, 400, 'customCost must be a non-negative number.');
    }
  }

  next();
};

export const validateDeleteItineraryActivity = (req, res, next) => {
  const { itineraryActivityId } = req.params;

  if (!isPositiveInteger(itineraryActivityId)) {
    return errorResponse(res, 400, 'Valid itineraryActivityId is required.');
  }

  next();
};
