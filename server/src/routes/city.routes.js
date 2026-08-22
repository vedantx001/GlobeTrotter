import express from 'express';
import { getCities } from '../controllers/city.controller.js';
import { validateCitySearch } from '../validators/city.validator.js';

const router = express.Router();

// Public endpoint for city search and discovery
router.get('/', validateCitySearch, getCities);

export default router;
