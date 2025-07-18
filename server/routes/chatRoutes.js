import express from 'express';
import { getMessages } from '../controllers/chatController.js';

const router = express.Router();

// GET /api/messages/:roomId
router.get('/messages/:roomId', getMessages);

export default router;

