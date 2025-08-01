const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
  updateOrderStatus,
  updateOrderToPaid,
  updateOrderToDelivered
} = require('../controllers/orders');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Protected routes (user must be authenticated)
router.use(protect);

// User routes
router.get('/my-orders', getMyOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);

// Admin routes
router.get('/', authorize('admin'), getOrders);
router.put('/:id', authorize('admin'), updateOrder);
router.delete('/:id', authorize('admin'), deleteOrder);
router.put('/:id/status', authorize('admin'), updateOrderStatus);
router.put('/:id/pay', authorize('admin'), updateOrderToPaid);
router.put('/:id/deliver', authorize('admin'), updateOrderToDelivered);

module.exports = router;
