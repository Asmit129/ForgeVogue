import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false, // Inquiries can be general, not always tied to a product
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    adminReply: {
      type: String,
      default: "", // Simple threading: Admin can leave a direct reply
    },
    status: {
      type: String,
      enum: ["Open", "In Process", "Resolved"],
      default: "Open",
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
