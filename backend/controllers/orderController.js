import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";

// @desc    Create a new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, couponCode, discount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    let totalPrice = 0;
    const processedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.status !== "verified") {
        return res.status(400).json({ message: `Product not available: ${product.title}` });
      }
      totalPrice += product.price * item.qty;
      processedItems.push({
        product: product._id,
        title: product.title,
        qty: item.qty,
        price: product.price,
        image: product.images[0] || "",
      });
    }

    // Apply coupon discount
    let appliedDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date() < new Date(coupon.expiresAt) && coupon.usedCount < coupon.maxUses) {
        if (coupon.discountType === "percentage") {
          appliedDiscount = Math.round((totalPrice * coupon.value) / 100);
        } else {
          appliedDiscount = coupon.value;
        }
        appliedDiscount = Math.min(appliedDiscount, totalPrice);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: processedItems,
      shippingAddress,
      totalPrice: totalPrice - appliedDiscount,
      couponCode: couponCode || "",
      discount: appliedDiscount,
      statusHistory: [{ status: "Order Placed", note: `${processedItems.length} item(s)` }],
    });

    // Notify admins about new order
    const admins = await User.find({ isAdmin: true });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        message: `New order placed! ORD-${order._id.toString().slice(-6)} — ₹${order.totalPrice.toLocaleString()} by ${req.user.name}`,
        type: "order",
        link: "/admin",
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "title images")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "title images");

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Get all orders
// @route   GET /api/orders/admin/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Update order status
// @route   PUT /api/orders/admin/:id
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const newStatus = req.body.status || order.status;
    order.status = newStatus;
    order.statusHistory.push({ status: newStatus, note: req.body.note || "" });

    if (newStatus === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      // Update collector badge
      const buyer = await User.findById(order.user);
      if (buyer) {
        buyer.totalSpent = (buyer.totalSpent || 0) + order.totalPrice;
        buyer.updateBadge();
        await buyer.save();
      }
    }
    if (req.body.isPaid !== undefined) {
      order.isPaid = req.body.isPaid;
      if (req.body.isPaid) order.paidAt = new Date();
    }

    const updated = await order.save();

    // Notify buyer about status change
    await Notification.create({
      user: order.user,
      message: `Order ORD-${order._id.toString().slice(-6)} has been updated to: ${newStatus}`,
      type: "order",
      link: "/my-orders",
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
