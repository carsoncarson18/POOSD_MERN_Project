const express = require('express');
const { getAllUsers, createUser } = require('../controllers/userController');
const router = express.Router();

// GET all users
router.get('/', getAllUsers);

// POST create a new user
router.post('/', createUser);

module.exports = router;