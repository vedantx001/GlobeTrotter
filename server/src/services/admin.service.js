import { pool } from '../config/db.js';

/**
 * Service to fetch comprehensive admin analytics data.
 * Aggregates statistics for users, trips, activities, and cities.
 * 
 * @returns {Promise<Object>} Analytics data object
 */
export const getAnalyticsData = async () => {
  // Use a single connection for all queries to optimize database resources
  const connection = await pool.getConnection();
  
  try {
    // 1. Total Users
    const [usersResult] = await connection.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = usersResult[0].count;

    // 2. Total Trips
    const [tripsResult] = await connection.query('SELECT COUNT(*) as count FROM trips');
    const totalTrips = tripsResult[0].count;

    // 3. Total Activities Planned
    const [activitiesPlannedResult] = await connection.query('SELECT COUNT(*) as count FROM itinerary_activities');
    const totalActivitiesPlanned = activitiesPlannedResult[0].count;

    // 4. Public Trips
    const [publicTripsResult] = await connection.query('SELECT COUNT(*) as count FROM trips WHERE is_public = true');
    const publicTrips = publicTripsResult[0].count;

    // 5. Popular Cities (Top 5 by trip stop usage)
    const [popularCities] = await connection.query(`
      SELECT 
        c.id as cityId, 
        c.name as cityName, 
        COUNT(ts.id) as tripCount
      FROM cities c
      JOIN trip_stops ts ON c.id = ts.city_id
      GROUP BY c.id, c.name
      ORDER BY tripCount DESC
      LIMIT 5
    `);

    // 6. Popular Activities (Top 5 by itinerary usage)
    const [popularActivities] = await connection.query(`
      SELECT 
        a.id as activityId, 
        a.title as title, 
        COUNT(ia.id) as usageCount
      FROM activities a
      JOIN itinerary_activities ia ON a.id = ia.activity_id
      GROUP BY a.id, a.title
      ORDER BY usageCount DESC
      LIMIT 5
    `);

    // 7. Recent Trips (Latest 10 trips)
    const [recentTrips] = await connection.query(`
      SELECT 
        t.id as tripId, 
        t.title as tripTitle, 
        CONCAT(u.first_name, ' ', u.last_name) as userName, 
        t.created_at as createdAt
      FROM trips t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 10
    `);

    // Return the aggregated metrics in the exact specified format
    return {
      summary: {
        totalUsers,
        totalTrips,
        totalActivitiesPlanned,
        publicTrips
      },
      popularCities,
      popularActivities,
      recentTrips
    };
  } finally {
    // Always release the connection back to the pool
    connection.release();
  }
};
