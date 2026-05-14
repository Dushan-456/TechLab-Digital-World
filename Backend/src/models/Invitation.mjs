import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
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
         enum: {
            values: ["ethereal", "lumina", "kinetic"],
            message: "Template must be either 'ethereal', 'lumina', or 'kinetic'",
         },
      },
      couple: {
         bride: {
            type: String,
            required: [true, "Bride name is required"],
            trim: true,
         },
         groom: {
            type: String,
            required: [true, "Groom name is required"],
            trim: true,
         },
      },
      event: {
         date: {
            type: Date,
            required: [true, "Event date is required"],
         },
         location: {
            type: String,
            required: [true, "Event location is required"],
            trim: true,
         },
      },
      content: {
         welcomeText: {
            type: String,
            default: "Together with their families, request the pleasure of your company",
            trim: true,
         },
      },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
      isPublished: {
         type: Boolean,
         default: true,
      },
      views: {
         type: Number,
         default: 0,
      },
   },
   {
      timestamps: true,
   }
);

// Index for faster lookups
invitationSchema.index({ cardId: 1 });
invitationSchema.index({ createdBy: 1 });

const Invitation = mongoose.model("Invitation", invitationSchema);

export default Invitation;
