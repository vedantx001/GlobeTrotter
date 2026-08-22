import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readJson = (filename) => {
  return JSON.parse(readFileSync(join(__dirname, filename), 'utf8'));
};

const countries = readJson('countries.json');
const cities = readJson('cities.json');
const activities = readJson('activities.json');
const activityPlaces = readJson('activity_places.json');
const communityExperiences = readJson('community_experiences.json');
const demoTrips = readJson('demo_trips.json');

let hasErrors = false;

const reportError = (msg) => {
  console.error(`❌ ERROR: ${msg}`);
  hasErrors = true;
};

const checkUniqueIds = (arr, name) => {
  const ids = new Set();
  arr.forEach(item => {
    if (ids.has(item.id)) {
      reportError(`Duplicate ID found in ${name}: ${item.id}`);
    }
    ids.add(item.id);
  });
};

const countryIds = new Set(countries.map(c => c.id));
const cityIds = new Set(cities.map(c => c.id));
const activityIds = new Set(activities.map(a => a.id));
const placeIds = new Set(activityPlaces.map(p => p.id));

console.log('Validating data...');

// 1. Duplicate IDs
checkUniqueIds(countries, 'countries.json');
checkUniqueIds(cities, 'cities.json');
checkUniqueIds(activities, 'activities.json');
checkUniqueIds(activityPlaces, 'activity_places.json');
checkUniqueIds(communityExperiences, 'community_experiences.json');
checkUniqueIds(demoTrips, 'demo_trips.json');

// 2. City -> Country References
cities.forEach(city => {
  if (!countryIds.has(city.countryId)) {
    reportError(`cities.json: City ${city.id} references missing countryId ${city.countryId}`);
  }
});

// 3. Activity Place References
activityPlaces.forEach(place => {
  if (!activityIds.has(place.activityId)) {
    reportError(`activity_places.json: Place ${place.id} references missing activityId ${place.activityId}`);
  }
  if (!cityIds.has(place.cityId)) {
    reportError(`activity_places.json: Place ${place.id} references missing cityId ${place.cityId}`);
  }
});

// 4. Community References
communityExperiences.forEach(exp => {
  if (!cityIds.has(exp.cityId)) {
    reportError(`community_experiences.json: Experience ${exp.id} references missing cityId ${exp.cityId}`);
  }
  if (exp.activityId && !activityIds.has(exp.activityId)) {
    reportError(`community_experiences.json: Experience ${exp.id} references missing activityId ${exp.activityId}`);
  }
});

// 5. Demo Trip References
demoTrips.forEach(trip => {
  trip.countryIds.forEach(cid => {
    if (!countryIds.has(cid)) {
      reportError(`demo_trips.json: Trip ${trip.id} references missing countryId ${cid}`);
    }
  });

  trip.stops.forEach(stop => {
    if (!cityIds.has(stop.cityId)) {
      reportError(`demo_trips.json: Trip ${trip.id} stop references missing cityId ${stop.cityId}`);
    }
    stop.activities.forEach(act => {
      if (!placeIds.has(act.activityPlaceId)) {
        reportError(`demo_trips.json: Trip ${trip.id} activity references missing activityPlaceId ${act.activityPlaceId}`);
      }
    });
  });
});

if (hasErrors) {
  console.error('\nDATA VALIDATION FAILED');
  process.exit(1);
} else {
  console.log('✅ ALL VALIDATION PASSED');
  console.log(`- Countries: ${countries.length}`);
  console.log(`- Cities: ${cities.length}`);
  console.log(`- Activities: ${activities.length}`);
  console.log(`- Activity Places: ${activityPlaces.length}`);
  console.log(`- Community Experiences: ${communityExperiences.length}`);
  console.log(`- Demo Trips: ${demoTrips.length}`);
  process.exit(0);
}
