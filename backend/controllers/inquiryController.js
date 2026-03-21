import Inquiry from "../models/Inquiry.js";

// @desc    Create a new inquiry (User)
// @route   POST /api/inquiries
export const createInquiry = async (req, res) => {
  try {
    const { product, subject, message } = req.body;

    const inquiry = await Inquiry.create({
      user: req.user._id,
      product: product || null,
      subject,
      message,
    });

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's own inquiries (User)
// @route   GET /api/inquiries/my-inquiries
export const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user._id })
      .populate("product", "title images")
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries/admin/all
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({})
      .populate("user", "name email")
      .populate("product", "title images")
      .sort({ status: 1, createdAt: -1 }); // Open ones usually bubble up or just sort by date
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Inquiry with Admin Reply (Admin)
// @route   PUT /api/inquiries/admin/:id
export const updateInquiryAdmin = async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    inquiry.status = status || inquiry.status;
    if (adminReply !== undefined) {
      inquiry.adminReply = adminReply;
    }

    const updatedInquiry = await inquiry.save();
    res.json(updatedInquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
