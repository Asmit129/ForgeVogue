import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Product from "../models/Product.js";

const generateToken = (id) => {
  return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/auth/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle product in watchlist
// @route   POST /api/auth/watchlist/:id
export const toggleWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.id;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isWatched = user.watchlist.some(id => id.toString() === productId);
    if (isWatched) {
      user.watchlist.pull(productId);
    } else {
      user.watchlist.addToSet(productId);
    }

    await user.save();
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user watchlist
// @route   GET /api/auth/watchlist
export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("watchlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const validWatchlist = user.watchlist.filter((p) => p !== null);
    res.json(validWatchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public seller profile and their active inventory
// @route   GET /api/auth/seller/:id
// @access  Public
export const getSellerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -email -isAdmin -watchlist");
    if (!user) {
      return res.status(404).json({ message: "Collector identity not found" });
    }
    
    // Fetch their active public inventory
    const products = await Product.find({ seller: user._id, status: "verified" });
    
    res.json({
      seller: user,
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
