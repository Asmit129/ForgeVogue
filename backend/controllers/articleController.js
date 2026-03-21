import Article from "../models/Article.js";

// @desc    Get all published articles
// @route   GET /api/articles
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single article by slug
// @route   GET /api/articles/:slug
export const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new article (Admin)
// @route   POST /api/articles
export const createArticle = async (req, res) => {
  try {
    const { title, slug, author, coverImage, excerpt, content, readTime } = req.body;
    
    // Check if slug exists
    const existing = await Article.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Article with this slug already exists" });
    }

    const article = await Article.create({
      title,
      slug,
      author: author || "ForgeVogue Editorial",
      coverImage,
      excerpt,
      content,
      readTime: readTime || 5
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
