const express = require('express');
const { createSession, getSessionById, getMySessions, deleteSession} = require('../controllers/sessionController');
const {protect} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createSession); // Create a new session
router.get('/my-sessions', protect, getMySessions); //Get sessions for Logged in user
router.get('/:id', protect, getSessionById); //Get session by ID
router.delete('/:id', protect, deleteSession); //Delete session by Id

module.exports = router; 
