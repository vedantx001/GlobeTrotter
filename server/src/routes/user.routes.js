import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateUpdateProfile, validateCityId } from '../validators/user.validator.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', validateUpdateProfile, userController.updateProfile);

// Saved destinations routes
router.get('/saved-destinations', userController.getSavedDestinations);
router.post('/saved-destinations/:cityId', validateCityId, userController.toggleSavedDestination);

// Account route
router.delete('/account', userController.deleteAccount);

export default router;
