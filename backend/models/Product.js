import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Rare Sneakers",
        "Vintage Books",
        "Limited Edition Art",
        "Classic Watches",
        "Signed Memorabilia",
        "Vinyl Records",
        "Antique Collectibles",
        "Other",
      ],
    },
    rarity: {
      type: String,
      enum: ["Common", "Uncommon", "Rare", "Ultra Rare", "Legendary"],
      default: "Rare",
    },
    condition: {
      type: String,
      enum: ["Mint", "Near Mint", "Excellent", "Good", "Fair"],
      default: "Excellent",
    },
    images: [
      {
        type: String,
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    adminNote: {
      type: String,
      default: "",
    },
    yearOfOrigin: {
      type: String,
      default: "",
    },
    authenticityCertificate: {
      type: Boolean,
      default: false,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

// Index for search
productSchema.index({ title: "text", description: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
