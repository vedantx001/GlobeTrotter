import * as adminService from '../services/admin.service.js';

/**
 * Controller to handle fetching admin analytics.
 * Provides summary metrics, popular cities, popular activities, and recent trips.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAnalytics = async (req, res) => {
  try {
    // Fetch aggregated analytics data from the service layer
    const data = await adminService.getAnalyticsData();
    
    // Return formatted success response strictly matching the requested format
    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    
    // Fallback to error response if something goes wrong
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics data'
    });
  }
};
