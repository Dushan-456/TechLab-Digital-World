import mongoose from "mongoose";

const businessCardSchema = new mongoose.Schema(
   {
      cardId: {
         type: String,
         required: [true, "Card ID (slug) is required"],
         unique: true,
         trim: true,
         lowercase: true,
         match: [/^[a-z0-9-]+$/, "Card ID can only contain lowercase letters, numbers, and hyphens"],
      },
      templateId: {
         type: String,
         required: [true, "Template selection is required"],
      },
      personalInfo: {
         fullName: { type: String, required: true, trim: true },
         jobTitle: { type: String, trim: true },
         company: { type: String, trim: true },
         bio: { type: String, trim: true },
         profilePic: { type: String, trim: true },
      },
      contactInfo: {
         email: { type: String, trim: true },
         phone: { type: String, trim: true },
         website: { type: String, trim: true },
         address: { type: String, trim: true },
      },
      socialLinks: {
         linkedin: { type: String, trim: true },
         twitter: { type: String, trim: true },
         github: { type: String, trim: true },
         instagram: { type: String, trim: true },
      },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
      isPublished: {
         type: Boolean,
         default: true,
      },
      status: {
         type: String,
         enum: ["PENDING_PAYMENT", "PAYMENT_UNDER_REVIEW", "ACTIVE", "REJECTED"],
         default: "PENDING_PAYMENT",
      },
      payment: {
         slipUrl: { type: String, default: null },
         uploadedAt: { type: Date, default: null },
         bankName: { type: String, trim: true },
         referenceNumber: { type: String, trim: true },
         amount: { type: Number, default: 0 },
         verifiedAt: { type: Date, default: null },
         verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
         rejectionReason: { type: String, default: null },
      },
      price: {
         type: Number,
         default: 0,
      },
      views: {
         type: Number,
         default: 0,
      },
   },
   { timestamps: true }
);

export const BusinessCard = mongoose.model("BusinessCard", businessCardSchema);
export default BusinessCard;
