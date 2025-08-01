const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/users');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

// Stats route
router.get('/stats', getUserStats);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
