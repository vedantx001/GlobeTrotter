import {
  countries,
  cities,
  activities,
  activityPlaces
} from '../data';

// --- HELPERS ---

const getCity = (cityId) => cities.find(c => c.id === cityId);
const getCountry = (countryId) => countries.find(c => c.id === countryId);
const getActivity = (activityId) => activities.find(a => a.id === activityId);

// Denormalize the data for easy searching/filtering
const getFlatActivityPlaces = () => {
  return activityPlaces.map(place => {
    const act = getActivity(place.activityId);
    const city = getCity(place.cityId);
    const country = city ? getCountry(city.countryId) : null;

    return {
      ...place,
      activity: act,
      city: city,
      country: country,
      // Create a massive search string for case-insensitive matching
      _searchString: [
        place.name,
        act?.title,
        act?.category,
        ...(place.tags || []),
        ...(act?.tags || []),
        city?.name,
        country?.name
      ].filter(Boolean).join(' ').toLowerCase()
    };
  });
};

const getFlatCities = () => {
  return cities.map(city => {
    const country = getCountry(city.countryId);
    return {
      ...city,
      country: country,
      _searchString: [
        city.name,
        city.region,
        country?.name,
        ...(city.tags || [])
      ].filter(Boolean).join(' ').toLowerCase()
    };
  });
};

// --- ACTIVITY MODE PIPELINE ---

export const getActivitiesPipeline = (query, filters, sortMode, groupMode) => {
  let results = getFlatActivityPlaces();

  // 1. Search
  if (query && query.trim() !== '') {
    const q = query.trim().toLowerCase();
    results = results.filter(item => item._searchString.includes(q));
  }

  // 2. Filter
  if (filters) {
    if (filters.category && filters.category !== 'All') {
      results = results.filter(item => item.activity?.category === filters.category);
    }
    if (filters.priceLevel && filters.priceLevel !== 'All') {
      results = results.filter(item => item.priceLevel === filters.priceLevel);
    }
    if (filters.minRating && filters.minRating !== 'All') {
      const min = parseFloat(filters.minRating);
      results = results.filter(item => item.rating >= min);
    }
    if (filters.duration && filters.duration !== 'All') {
      results = results.filter(item => {
        if (filters.duration === 'Under 2 hours') return item.durationHours < 2;
        if (filters.duration === '2-4 hours') return item.durationHours >= 2 && item.durationHours <= 4;
        if (filters.duration === '4+ hours') return item.durationHours > 4;
        return true;
      });
    }
    if (filters.country && filters.country !== 'All') {
      results = results.filter(item => item.country?.name === filters.country);
    }
  }

  // 3. Sort
  results = results.sort((a, b) => {
    if (sortMode === 'Highest Rated') {
      return b.rating - a.rating;
    }
    if (sortMode === 'Price: Low to High') {
      return a.estimatedCost - b.estimatedCost;
    }
    if (sortMode === 'Price: High to Low') {
      return b.estimatedCost - a.estimatedCost;
    }
    // Default: Popular (popularityScore descending)
    return b.popularityScore - a.popularityScore;
  });

  // 4. Group
  if (groupMode && groupMode !== 'None') {
    const groups = {};
    results.forEach(item => {
      let key = 'Other';
      if (groupMode === 'Country') key = item.country?.name || 'Unknown';
      if (groupMode === 'City') key = item.city?.name || 'Unknown';
      if (groupMode === 'Category') key = item.activity?.category || 'Unknown';
      if (groupMode === 'Price') key = item.priceLevel || 'Unknown';

      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    
    // Sort groups alphabetically (except Price maybe)
    const sortedGroupKeys = Object.keys(groups).sort();
    return { isGrouped: true, groups, sortedGroupKeys };
  }

  return { isGrouped: false, results };
};

// --- CITY MODE PIPELINE ---

export const getCitiesPipeline = (query, filters, sortMode) => {
  let results = getFlatCities();

  // 1. Search
  if (query && query.trim() !== '') {
    const q = query.trim().toLowerCase();
    results = results.filter(item => item._searchString.includes(q));
  }

  // 2. Filter
  if (filters) {
    if (filters.country && filters.country !== 'All') {
      results = results.filter(item => item.country?.name === filters.country);
    }
    if (filters.region && filters.region !== 'All') {
      results = results.filter(item => item.region === filters.region);
    }
    if (filters.costIndex && filters.costIndex !== 'All') {
      results = results.filter(item => item.costIndex === parseInt(filters.costIndex));
    }
    if (filters.popularity && filters.popularity !== 'All') {
      if (filters.popularity === 'High (90+)') results = results.filter(item => item.popularityScore >= 90);
      if (filters.popularity === 'Medium (80-89)') results = results.filter(item => item.popularityScore >= 80 && item.popularityScore < 90);
    }
  }

  // 3. Sort (Default by popularity)
  results = results.sort((a, b) => b.popularityScore - a.popularityScore);

  return { isGrouped: false, results };
};

// Extractor helpers for filter dropdowns
export const getAvailableCountries = () => [...new Set(countries.map(c => c.name))].sort();
export const getAvailableRegions = () => [...new Set(cities.map(c => c.region))].sort();
export const getAvailableCategories = () => [...new Set(activities.map(a => a.category))].sort();
