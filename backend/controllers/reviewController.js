import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Create a review
// @route   POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    // Check if user purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      "orderItems.product": product,
      isPaid: true,
    });

    // Check for existing review
    const existingReview = await Review.findOne({ user: req.user._id, product });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this artifact" });
    }

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment,
      isVerifiedPurchase: !!hasPurchased,
    });

    const populated = await Review.findById(review._id).populate("user", "name");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    
    // Calculate average
    const totalRatings = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    res.json({ reviews, averageRating: Number(averageRating), numReviews: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
