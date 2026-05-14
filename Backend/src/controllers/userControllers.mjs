import { matchedData, validationResult } from "express-validator";
import User from "../models/User.mjs";
import bcrypt from "bcrypt";
import { errorCreate } from "../utils/error-creator.mjs";
import { generateTokenWithCookies } from "../utils/jwt.mjs";

class UserControllers {
   RegisterNewUser = async (req, res) => {
      const error = validationResult(req);
      if (error.array().length) {
         return res.status(400).json({
            msg: "Validation error",
            error: errorCreate(error.array()),
            data: null,
         });
      }

      const { firstName, lastName, username, email, password } = matchedData(req);

      try {
         const existingUser = await User.findOne({ $or: [{ email }, { username }] });
         if (existingUser) {
            return res.status(409).json({ error: "Username or Email is already taken." });
         }

         const salt = await bcrypt.genSalt(10);
         const passwordHash = await bcrypt.hash(password, salt);

         const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            passwordHash,
         });

         const { passwordHash: _, ...userWithoutPassword } = newUser.toObject();

         res.status(201).json({
            message: "User created successfully!",
            user: userWithoutPassword,
         });
      } catch (error) {
         console.error("Error Registering user:", error);
         res.status(500).json({ message: "Server error during registration" });
      }
   };

   loginUser = async (req, res) => {
      const error = validationResult(req);
      if (error.array().length) {
         return res.status(400).json({
            msg: "Validation error",
            error: errorCreate(error.array()),
            data: null,
         });
      }

      const { emailOrUsername, password } = matchedData(req);
      try {
         const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
         });

         if (!user) {
            return res.status(401).json({ error: "User Name or Email Not Registered in System" });
         }

         const isMatch = await bcrypt.compare(password, user.passwordHash);

         if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
         }

         generateTokenWithCookies(res, user._id);
         const { passwordHash: _, ...userWithoutPassword } = user.toObject();

         res.status(200).json({
            message: "Login Successful",
            user: userWithoutPassword,
         });
      } catch (error) {
         console.error(error);
         res.status(500).json({ message: "Server error during login" });
      }
   };

   logoutUser = (req, res) => {
      res.cookie("jwt", "", {
         httpOnly: true,
         expires: new Date(0),
      });
      res.status(200).json({ message: "Logged out successfully" });
   };

   myProfile = async (req, res) => {
      const userId = req.authUser.id;
      try {
         const user = await User.findById(userId).select("-passwordHash");
         if (!user) {
            return res.status(404).json({ message: `User not found.` });
         }
         res.status(200).json({
            message: "User profile retrieved successfully!",
            data: user,
         });
      } catch (error) {
         console.error("Error fetching user profile:", error);
         res.status(500).json({ message: "An unexpected error occurred." });
      }
   };
}

export default new UserControllers();
