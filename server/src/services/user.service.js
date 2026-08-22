import { pool } from '../config/db.js';

/**
 * Fetch complete profile information for the authenticated user.
 * @param {number} userId - The ID of the authenticated user.
 * @returns {Promise<Object>} The user profile data.
 */
export const getProfile = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
        id, 
        first_name as firstName, 
        last_name as lastName, 
        email, 
        phone, 
        profile_image as profileImage, 
        city, 
        country, 
        role 
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      throw new Error('User not found');
    }

    return rows[0];
  } finally {
    connection.release();
  }
};

/**
 * Update user profile.
 * @param {number} userId - The ID of the authenticated user.
 * @param {Object} updateData - Data to update (firstName, lastName, phone, profileImage, city, country).
 * @returns {Promise<void>}
 */
export const updateProfile = async (userId, updateData) => {
  const connection = await pool.getConnection();
  try {
    // Build dynamic query based on provided fields
    const fields = [];
    const values = [];

    const fieldMap = {
      firstName: 'first_name',
      lastName: 'last_name',
      phone: 'phone',
      profileImage: 'profile_image',
      city: 'city',
      country: 'country'
    };

    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (updateData[key] !== undefined) {
        fields.push(`${dbField} = ?`);
        values.push(updateData[key]);
      }
    }

    if (fields.length === 0) {
      return; // Nothing to update
    }

    values.push(userId); // For the WHERE clause

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    await connection.query(query, values);
  } finally {
    connection.release();
  }
};

/**
 * Return all bookmarked cities.
 * @param {number} userId - The ID of the authenticated user.
 * @returns {Promise<Array>} List of saved destinations.
 */
export const getSavedDestinations = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
        c.id, 
        c.name, 
        c.country, 
        c.region, 
        c.cost_index as costIndex, 
        c.popularity_score as popularityScore, 
        c.image_url as imageUrl, 
        c.description 
       FROM saved_destinations sd
       JOIN cities c ON sd.city_id = c.id
       WHERE sd.user_id = ?`,
      [userId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

/**
 * Toggle bookmark for a city.
 * @param {number} userId - The ID of the authenticated user.
 * @param {number} cityId - The ID of the city.
 * @returns {Promise<string>} 'Destination saved' or 'Destination removed'
 */
export const toggleSavedDestination = async (userId, cityId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check if city exists
    const [cities] = await connection.query('SELECT id FROM cities WHERE id = ?', [cityId]);
    if (cities.length === 0) {
      throw new Error('City not found');
    }

    // Check if already saved
    const [saved] = await connection.query(
      'SELECT id FROM saved_destinations WHERE user_id = ? AND city_id = ? FOR UPDATE',
      [userId, cityId]
    );

    if (saved.length > 0) {
      // Remove bookmark
      await connection.query('DELETE FROM saved_destinations WHERE id = ?', [saved[0].id]);
      await connection.commit();
      return 'Destination removed';
    } else {
      // Create bookmark
      await connection.query(
        'INSERT INTO saved_destinations (user_id, city_id) VALUES (?, ?)',
        [userId, cityId]
      );
      await connection.commit();
      return 'Destination saved';
    }
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Delete authenticated user account.
 * @param {number} userId - The ID of the authenticated user.
 * @returns {Promise<void>}
 */
export const deleteAccount = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      throw new Error('User not found');
    }
  } finally {
    connection.release();
  }
};
