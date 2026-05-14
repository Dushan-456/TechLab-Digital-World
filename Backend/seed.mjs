import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./src/models/User.mjs";

dotenv.config();

const seedAdmin = async () => {
   try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log(`Connected to MongoDB for seeding...`);

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

      await mongoose.disconnect();
      console.log("Disconnected from MongoDB.");
   } catch (error) {
      console.error("Error seeding database:", error);
      process.exit(1);
   }
};

seedAdmin();
