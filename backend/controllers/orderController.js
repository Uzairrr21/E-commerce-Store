const Order = require('../models/Order');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Enhanced validation
  if (!orderItems || !Array.isArray(orderItems)) {
    res.status(400);
    throw new Error('Order items must be an array');
  }

  if (orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Validate shipping address
  if (!shippingAddress || 
      !shippingAddress.address || 
      !shippingAddress.city || 
      !shippingAddress.postalCode || 
      !shippingAddress.country) {
    res.status(400);
    throw new Error('Please provide complete shipping address');
  }

  // Validate payment method
  if (!paymentMethod) {
    res.status(400);
    throw new Error('Payment method is required');
  }

  // Validate all product IDs and quantities
  for (const item of orderItems) {
    if (!mongoose.Types.ObjectId.isValid(item.product)) {
      res.status(400);
      throw new Error(`Invalid product ID: ${item.product}`);
    }
    if (!item.qty || isNaN(item.qty) || item.qty <= 0) {
      res.status(400);
      throw new Error(`Invalid quantity for product ${item.product}`);
    }
  }

  try {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500);
    throw new Error('Failed to create order. Please try again.');
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  // Validate the order ID first
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid order ID');
  }

  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image price');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check authorization
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500);
    throw new Error('Failed to fetch order. Please try again.');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name image price');
    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500);
    throw new Error('Failed to fetch your orders. Please try again.');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .populate('orderItems.product', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500);
    throw new Error('Failed to fetch orders. Please try again.');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid order ID');
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update to paid error:', error);
    res.status(500);
    throw new Error('Failed to update order status. Please try again.');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid order ID');
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update to delivered error:', error);
    res.status(500);
    throw new Error('Failed to update delivery status. Please try again.');
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
};