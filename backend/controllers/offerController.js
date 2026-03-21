import Offer from "../models/Offer.js";
import Product from "../models/Product.js";
import Notification from "../models/Notification.js";

// @desc    Create a new offer
// @route   POST /api/offers
export const createOffer = async (req, res) => {
  try {
    const { product, amount, message } = req.body;
    const targetProduct = await Product.findById(product);
    
    if (!targetProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (targetProduct.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot bid on your own item" });
    }

    const offer = await Offer.create({
      product,
      buyer: req.user._id,
      seller: targetProduct.seller,
      amount,
      message
    });

    // Notify the seller
    await Notification.create({
      user: targetProduct.seller,
      message: `New private offer of ₹${Number(amount).toLocaleString()} for "${targetProduct.title}" from ${req.user.name}`,
      type: "offer",
      link: "/profile",
    });

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get offers made by me
// @route   GET /api/offers/my-offers
export const getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ buyer: req.user._id })
      .populate("product", "title images price")
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get offers received (for active seller)
// @route   GET /api/offers/received
export const getReceivedOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ seller: req.user._id, status: "Pending" })
      .populate("product", "title images price")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update offer status (accept/reject)
// @route   PUT /api/offers/:id/status
export const updateOfferStatus = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    
    // Only the seller or admin can accept/reject
    if (offer.seller.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    offer.status = req.body.status || offer.status;
    const updatedOffer = await offer.save();

    // Notify the buyer about accept/reject
    const statusText = offer.status === "Accepted" ? "accepted" : "rejected";
    await Notification.create({
      user: offer.buyer,
      message: `Your private offer has been ${statusText}!`,
      type: "offer",
      link: "/profile",
    });

    res.json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Get all offers
// @route   GET /api/offers/admin/all
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({})
      .populate("product", "title images price")
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
