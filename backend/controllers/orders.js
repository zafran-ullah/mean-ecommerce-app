const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No order items'
    });
  }

  // Verify products exist and get current prices
  const verifiedItems = [];
  for (let item of orderItems) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${item.product}`
      });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}`
      });
    }

    verifiedItems.push({
      product: item.product,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price, // Use current product price
      quantity: item.quantity
    });

    // Update product stock
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    orderItems: verifiedItems,
    user: req.user.id,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  // Generate tracking number
  order.generateTrackingNumber();
  await order.save();

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const total = await Order.countDocuments({ user: req.user.id });
  
  const orders = await Order.find({ user: req.user.id })
    .populate('orderItems.product', 'name images')
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit);

  // Pagination result
  const pagination = {};
  const endIndex = page * limit;

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pagination,
    orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns the order or is admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to view this order'
    });
  }

  res.status(200).json({
    success: true,
    order
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  // Build filter object
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.isPaid) {
    filter.isPaid = req.query.isPaid === 'true';
  }
  if (req.query.isDelivered) {
    filter.isDelivered = req.query.isDelivered === 'true';
  }

  const total = await Order.countDocuments(filter);
  
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name')
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit);

  // Pagination result
  const pagination = {};
  const endIndex = page * limit;

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pagination,
    orders
  });
});

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = asyncHandler(async (req, res) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    order
  });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // If order is not delivered, restore product stock
  if (!order.isDelivered) {
    for (let item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully'
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  order.status = status;

  // If order is delivered, set delivered date
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  // If order is cancelled and not delivered, restore stock
  if (status === 'cancelled' && !order.isDelivered) {
    for (let item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    order
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address
  };

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: 'Order marked as paid',
    order: updatedOrder
  });
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'delivered';

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: 'Order marked as delivered',
    order: updatedOrder
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  updateOrderToPaid,
  updateOrderToDelivered
};
