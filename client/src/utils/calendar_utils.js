import { cities, activities, activityPlaces } from '../data';

// --- DATA RESOLVERS ---

const getCity = (cityId) => cities.find(c => c.id === cityId);
const getPlace = (placeId) => activityPlaces.find(p => p.id === placeId);
const getActivity = (activityId) => activities.find(a => a.id === activityId);

// --- DATE UTILS ---

/**
 * Returns a string in 'YYYY-MM-DD' format, safely accounting for local timezone.
 */
export const toDateString = (dateObj) => {
  if (!dateObj || isNaN(dateObj.getTime())) return null;
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Generates a 2D array of weeks representing the month grid (Sunday - Saturday).
 * Includes padding days from the previous and next month to complete the grid.
 */
export const generateMonthGrid = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Go back to Sunday

  const endDate = new Date(lastDay);
  if (endDate.getDay() !== 6) {
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // Go forward to Saturday
  }

  const grid = [];
  let currentWeek = [];
  const iterDate = new Date(startDate);
  iterDate.setHours(12, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  while (iterDate <= endDate) {
    currentWeek.push({
      dateObj: new Date(iterDate),
      dateString: toDateString(iterDate),
      isCurrentMonth: iterDate.getMonth() === month,
      dayOfMonth: iterDate.getDate()
    });

    if (currentWeek.length === 7) {
      grid.push(currentWeek);
      currentWeek = [];
    }

    iterDate.setDate(iterDate.getDate() + 1);
  }

  // Push remaining days if any (due to timezone glitches)
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({
        dateObj: new Date(iterDate),
        dateString: toDateString(iterDate),
        isCurrentMonth: iterDate.getMonth() === month,
        dayOfMonth: iterDate.getDate()
      });
      iterDate.setDate(iterDate.getDate() + 1);
    }
    grid.push(currentWeek);
  }

  return grid;
};

// --- TRIP MAPPING ---

/**
 * Parses trip data and returns a map of date -> { stops: [], activities: [] }
 * 
 * @param {Object} trip - The trip object containing stops and activities
 */
export const mapTripDataToCalendar = (trip) => {
  const calendarMap = {};

  if (!trip || !trip.stops) return calendarMap;

  trip.stops.forEach((stop, stopIndex) => {
    if (!stop.startDate) return;

    const city = stop.city || getCity(stop.cityId);
    const cityName = city?.name || 'Unknown City';

    const start = new Date(stop.startDate);
    // Use endDate if available, else just start date. 
    // Careful with UTC string vs Local parsing. Assuming YYYY-MM-DD parses to UTC midnight.
    // To safely parse YYYY-MM-DD into local midnight, we do this:
    const parseLocalDate = (dateStr) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    const localStart = parseLocalDate(stop.startDate);
    const localEnd = stop.endDate ? parseLocalDate(stop.endDate) : new Date(localStart);

    // 1. Map Stop Ranges
    const iterDate = new Date(localStart);
    while (iterDate <= localEnd) {
      const dStr = toDateString(iterDate);
      if (!calendarMap[dStr]) {
        calendarMap[dStr] = { stops: [], activities: [] };
      }
      
      calendarMap[dStr].stops.push({
        ...stop,
        cityName,
        isFirstDay: iterDate.getTime() === localStart.getTime(),
        isLastDay: iterDate.getTime() === localEnd.getTime(),
        stopIndex
      });

      iterDate.setDate(iterDate.getDate() + 1);
    }

    // 2. Map Activities
    if (stop.activities) {
      stop.activities.forEach(act => {
        if (!act.scheduledDate) return;
        
        const actDateStr = act.scheduledDate;
        if (!calendarMap[actDateStr]) {
          calendarMap[actDateStr] = { stops: [], activities: [] };
        }

        // Resolve reference data if placeId is given
        const place = act.activityPlace || getPlace(act.activityPlaceId);
        const activityDef = place ? getActivity(place.activityId) : null;
        
        calendarMap[actDateStr].activities.push({
          ...act,
          id: act.id || act._id || Math.random().toString(36).substring(7),
          title: act.title || place?.name || 'Scheduled Activity',
          category: act.category || activityDef?.category || 'Uncategorized',
          estimatedCost: act.customCost || act.custom_cost || place?.estimatedCost || 0,
          cityName,
          placeObj: place,
          activityObj: activityDef
        });
      });
    }
  });

  return calendarMap;
};

// --- FILTERING ---

/**
 * Filters the compiled calendar map based on active search and filter controls.
 */
export const filterCalendarMap = (calendarMap, searchQuery, filters, groupBy) => {
  // Creating a deeply cloned map to avoid mutating the original
  const filteredMap = {};
  const q = searchQuery ? searchQuery.trim().toLowerCase() : '';

  Object.keys(calendarMap).forEach(dateStr => {
    const dayData = calendarMap[dateStr];
    
    // Filter activities
    let acts = [...dayData.activities];

    // Search query
    if (q) {
      acts = acts.filter(a => {
        return (
          a.title?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q) ||
          a.cityName?.toLowerCase().includes(q)
        );
      });
    }

    // Active filters
    if (filters) {
      if (filters.city && filters.city !== 'All') {
        acts = acts.filter(a => a.cityName === filters.city);
      }
      if (filters.category && filters.category !== 'All') {
        acts = acts.filter(a => a.category === filters.category);
      }
      if (filters.timeSlot && filters.timeSlot !== 'All') {
        acts = acts.filter(a => a.timeSlot === filters.timeSlot);
      }
    }

    // Group logic is generally applied on the rendering side (e.g. coloring by group),
    // but if we are grouping by City, we might hide non-matching stops.
    let stops = [...dayData.stops];
    if (q) {
      stops = stops.filter(s => s.cityName.toLowerCase().includes(q));
    }
    if (filters?.city && filters.city !== 'All') {
      stops = stops.filter(s => s.cityName === filters.city);
    }

    if (acts.length > 0 || stops.length > 0) {
      filteredMap[dateStr] = {
        stops,
        activities: acts
      };
    }
  });

  return filteredMap;
};
