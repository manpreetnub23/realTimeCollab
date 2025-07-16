const express = require('express');
const { getMessages } = require('../controllers/chatController');

const router = express.Router();

// GET /api/messages/:roomId
router.get('/messages/:roomId', getMessages);

module.exports = router;
