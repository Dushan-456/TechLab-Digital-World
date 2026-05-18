import mongoose from "mongoose";

const cardSettingSchema = new mongoose.Schema(
   {
      category: {
         type: String,
         required: [true, "Category is required"],
         enum: ["ceremonyType", "dressCode", "backgroundMusic", "receptionType"],
         trim: true,
      },
      value: {
         type: Number,
         required: [true, "Value is required"],
      },
      label: {
         type: String,
         required: [true, "Label is required"],
         trim: true,
      },
      url: {
         type: String,
         trim: true,
      },
      description: {
         type: String,
         trim: true,
         default: "",
      },
      sortOrder: {
         type: Number,
         default: 0,
      },
      isActive: {
         type: Boolean,
         default: true,
      },
   },
   {
      timestamps: true,
   }
);

// Compound unique index: each (category, value) pair must be unique
cardSettingSchema.index({ category: 1, value: 1 }, { unique: true });

// Index for efficient queries
cardSettingSchema.index({ category: 1, isActive: 1, sortOrder: 1 });

const CardSetting = mongoose.model("CardSetting", cardSettingSchema);

export default CardSetting;
