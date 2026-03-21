import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// @desc    Get all verified products (public)
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, rarity, search, page = 1, limit = 12 } = req.query;
    const query = { status: "verified" };

    if (category && category !== "All") {
      query.category = category;
    }
    if (rarity && rarity !== "All") {
      query.rarity = rarity;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    User submits a collectible item to sell
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      rarity,
      condition,
      yearOfOrigin,
      authenticityCertificate,
      countInStock,
    } = req.body;

    // Handle uploaded images
    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      rarity: rarity || "Rare",
      condition: condition || "Excellent",
      images,
      seller: req.user._id,
      status: "pending",
      yearOfOrigin: yearOfOrigin || "",
      authenticityCertificate: authenticityCertificate === "true",
      countInStock: Number(countInStock) || 1,
    });

    // Notify all admins
    const admins = await User.find({ isAdmin: true });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        message: `New artifact submitted for authentication: "${title}"`,
        type: "product",
        link: "/admin",
      });
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products submitted by the logged-in user
// @route   GET /api/products/my-listings
export const getMyListings = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Get all products (including pending)
// @route   GET /api/products/admin/all
export const getAllProductsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== "All") {
      query.status = status;
    }
    const products = await Product.find(query)
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Verify or reject a product
// @route   PUT /api/products/admin/:id/verify
export const verifyProduct = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!["verified", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be "verified" or "rejected"' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = status;
    product.adminNote = adminNote || "";
    await product.save();

    res.json({ message: `Product ${status}`, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Delete a product
// @route   DELETE /api/products/admin/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search products (autocomplete)
// @route   GET /api/products/search
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);
    
    const products = await Product.find({
      status: "verified",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    })
      .select("title price images category rarity")
      .limit(8)
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const related = await Product.find({
      _id: { $ne: product._id },
      status: "verified",
      $or: [
        { category: product.category },
        { rarity: product.rarity },
      ],
    })
      .select("title price images category rarity")
      .limit(4)
      .sort({ createdAt: -1 });

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
