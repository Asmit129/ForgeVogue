import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true, default: "ForgeVogue Editorial" },
    coverImage: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true }, // HTML or structured text
    readTime: { type: Number, required: true, default: 5 }, // minutes
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
