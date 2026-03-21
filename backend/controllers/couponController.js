import Coupon from "../models/Coupon.js";

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, value, minOrder, maxUses, expiresAt } = req.body;
    
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ message: "Coupon code already exists" });

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      value,
      minOrder: minOrder || 0,
      maxUses: maxUses || 100,
      expiresAt,
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate & apply coupon (User)
// @route   POST /api/coupons/validate
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return res.status(404).json({ message: "Invalid coupon code" });
    if (new Date() > new Date(coupon.expiresAt)) return res.status(400).json({ message: "Coupon has expired" });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: "Coupon usage limit reached" });
    if (orderTotal < coupon.minOrder) return res.status(400).json({ message: `Minimum order of ₹${coupon.minOrder} required` });

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round((orderTotal * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }
    discount = Math.min(discount, orderTotal);

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      discount,
      finalTotal: orderTotal - discount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
