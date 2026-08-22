import { pool } from '../config/db.js';
import { generateShareToken } from '../utils/shareToken.js';

/**
 * Shares a trip by generating a secure token and making it public.
 * @param {number} tripId - The ID of the trip to share.
 * @param {number} userId - The ID of the authenticated user.
 * @returns {Promise<string>} The share token.
 */
export const shareTrip = async (tripId, userId) => {
  // Verify trip ownership
  const [trips] = await pool.query(
    'SELECT id, is_public, share_token FROM trips WHERE id = ? AND user_id = ?',
    [tripId, userId]
  );

  if (trips.length === 0) {
    throw new Error('Trip not found or unauthorized access');
  }

  const trip = trips[0];

  // If already public, return existing token
  if (trip.is_public && trip.share_token) {
    return trip.share_token;
  }

  // Generate a new secure share token
  const token = generateShareToken();

  // Set is_public = true and store the token
  await pool.query(
    'UPDATE trips SET is_public = true, share_token = ? WHERE id = ?',
    [token, tripId]
  );

  return token;
};

/**
 * Retrieves complete public trip data without exposing private user details.
 * @param {string} shareToken - The unique share token for the trip.
 * @returns {Promise<Object>} An object containing the trip, its stops, and activities.
 */
export const getPublicTrip = async (shareToken) => {
  // Find the trip and ensure it is public
  const [trips] = await pool.query(
    'SELECT id, title, description, start_date, end_date, cover_image, total_budget FROM trips WHERE share_token = ? AND is_public = true',
    [shareToken]
  );

  if (trips.length === 0) {
    throw new Error('Public trip not found');
  }

  const trip = trips[0];

  // Fetch all stops for the trip
  const [stops] = await pool.query(
    'SELECT id, city_id, stop_order, start_date, end_date, notes FROM trip_stops WHERE trip_id = ? ORDER BY stop_order ASC',
    [trip.id]
  );

  // Fetch all activities associated with the stops
  let activities = [];
  if (stops.length > 0) {
    const stopIds = stops.map(stop => stop.id);
    const [acts] = await pool.query(
      'SELECT id, trip_stop_id, activity_id, scheduled_date, time_slot, custom_cost, notes FROM itinerary_activities WHERE trip_stop_id IN (?) ORDER BY scheduled_date ASC, time_slot ASC',
      [stopIds]
    );
    activities = acts;
  }

  return {
    trip,
    stops,
    activities
  };
};

/**
 * Clones a public trip to the authenticated user's account.
 * Uses a MySQL transaction to ensure data integrity.
 * @param {string} shareToken - The unique share token of the trip to fork.
 * @param {number} newUserId - The ID of the authenticated user forking the trip.
 * @returns {Promise<number>} The ID of the newly created cloned trip.
 */
export const forkTrip = async (shareToken, newUserId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Find trip by share token and verify it is public
    const [originalTrips] = await connection.query(
      'SELECT * FROM trips WHERE share_token = ? AND is_public = true FOR UPDATE',
      [shareToken]
    );

    if (originalTrips.length === 0) {
      throw new Error('Public trip not found');
    }

    const originalTrip = originalTrips[0];

    // 2. Create the new cloned trip
    const newTitle = `${originalTrip.title} (Copy)`;
    const [tripResult] = await connection.query(
      `INSERT INTO trips (user_id, title, description, start_date, end_date, cover_image, total_budget, is_public, share_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, false, NULL)`,
      [
        newUserId,
        newTitle,
        originalTrip.description,
        originalTrip.start_date,
        originalTrip.end_date,
        originalTrip.cover_image,
        originalTrip.total_budget
      ]
    );

    const newTripId = tripResult.insertId;

    // 3. Clone all stops
    const [originalStops] = await connection.query(
      'SELECT * FROM trip_stops WHERE trip_id = ? ORDER BY stop_order ASC',
      [originalTrip.id]
    );

    for (const stop of originalStops) {
      const [stopResult] = await connection.query(
        `INSERT INTO trip_stops (trip_id, city_id, stop_order, start_date, end_date, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          newTripId,
          stop.city_id,
          stop.stop_order,
          stop.start_date,
          stop.end_date,
          stop.notes
        ]
      );

      const newStopId = stopResult.insertId;

      // 4. Clone all itinerary activities for the current stop
      const [originalActivities] = await connection.query(
        'SELECT * FROM itinerary_activities WHERE trip_stop_id = ?',
        [stop.id]
      );

      for (const activity of originalActivities) {
        await connection.query(
          `INSERT INTO itinerary_activities (trip_stop_id, activity_id, scheduled_date, time_slot, custom_cost, notes)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            newStopId,
            activity.activity_id,
            activity.scheduled_date,
            activity.time_slot,
            activity.custom_cost,
            activity.notes
          ]
        );
      }
    }

    // 5. Commit transaction on success
    await connection.commit();
    return newTripId;

  } catch (error) {
    // 6. Rollback transaction on error
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
