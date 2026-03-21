import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";

let razorpayInstance = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const razorpay = getRazorpay();
    
    const options = {
      amount: Math.round(amount * 100), // Razorpay works in paise
      currency: "INR",
      receipt: orderId || `receipt_${Date.now()}`,
      notes: {
        forgeVogueOrderId: orderId || "",
        userId: req.user._id.toString(),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);
    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({ message: "Payment gateway error. " + error.message });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update order as paid
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentMethod = "Razorpay";
        order.razorpayOrderId = razorpay_order_id;
        order.razorpayPaymentId = razorpay_payment_id;
        order.status = "Processing";
        order.statusHistory.push({ status: "Payment Verified", note: `Payment ID: ${razorpay_payment_id}` });
        await order.save();

        // Notify admin
        const adminUsers = await (await import("../models/User.js")).default.find({ isAdmin: true });
        for (const admin of adminUsers) {
          await Notification.create({
            user: admin._id,
            message: `New payment received! Order #${order._id.toString().slice(-6)} — ₹${(order.totalPrice).toLocaleString()}`,
            type: "order",
            link: "/admin",
          });
        }
        // Notify buyer
        await Notification.create({
          user: order.user,
          message: `Payment confirmed for Order #${order._id.toString().slice(-6)}. Your artifacts are being prepared.`,
          type: "order",
          link: "/my-orders",
        });
      }

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: error.message });
  }
};
