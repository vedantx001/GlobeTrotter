import express from 'express';
import { getActivities } from '../controllers/city.controller.js';

const router = express.Router();

router.get('/', getActivities);

export default router;
