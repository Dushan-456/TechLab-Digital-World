import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./src/models/User.mjs";
import path from "path";

dotenv.config();

export const seedAdmin = async () => {
   try {
      // Check if any admin exists
      const adminExists = await User.findOne({ role: "ADMIN" });

      if (!adminExists) {
         console.log("No ADMIN user found. Creating default admin...");
         
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash("admin123", salt);

         const defaultAdmin = await User.create({
            firstName: "Super",
            lastName: "Admin",
            username: "admin",
            email: "admin@digitalwedding.com",
            passwordHash: hashedPassword,
            role: "ADMIN"
         });

         console.log(`Default admin created successfully!`);
         console.log(`Email: ${defaultAdmin.email}`);
         console.log(`Password: admin123`);
      } else {
         console.log("Admin user already exists. Skipping seed.");
      }
   } catch (error) {
      console.error("Error seeding database:", error);
      throw error;
   }
};

// Check if the script is run directly
import { fileURLToPath } from "url";
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
   mongoose.connect(process.env.MONGODB_URI)
      .then(async () => {
         console.log(`Connected to MongoDB for seeding...`);
         await seedAdmin();
         await mongoose.disconnect();
         console.log("Disconnected from MongoDB.");
         process.exit(0);
      })
      .catch((error) => {
         console.error("Error seeding database:", error);
         process.exit(1);
      });
}

