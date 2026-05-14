import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: [true, "First name is required"],
         trim: true,
      },
      lastName: {
         type: String,
         required: [true, "Last name is required"],
         trim: true,
      },
      username: {
         type: String,
         required: [true, "Username is required"],
         unique: true,
         trim: true,
         lowercase: true,
      },
      email: {
         type: String,
         required: [true, "Email is required"],
         unique: true,
         trim: true,
         lowercase: true,
         match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      },
      passwordHash: {
         type: String,
         required: [true, "Password is required"],
      },
      role: {
         type: String,
         enum: ["ADMIN", "USER"],
         default: "USER",
      },
      passwordResetToken: {
         type: String,
         default: null,
      },
      passwordResetExpires: {
         type: Date,
         default: null,
      },
   },
   {
      timestamps: true,
   }
);

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
   return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static method to hash password
userSchema.statics.hashPassword = async function (password) {
   const salt = await bcrypt.genSalt(10);
   return bcrypt.hash(password, salt);
};

const User = mongoose.model("User", userSchema);

export default User;
