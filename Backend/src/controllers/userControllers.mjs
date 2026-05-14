import { matchedData, validationResult } from "express-validator";
import User from "../models/User.mjs";
import bcrypt from "bcrypt";
import { generateTokenWithCookies } from "../utils/jwt.mjs";
import crypto from "crypto";
import { sendEmail } from "../services/emailService.mjs";

// Helper to generate a secure random token for forgot password token
const generateSecureToken = () => {
   return crypto.randomBytes(32).toString("hex"); // 64 char string
};

// Helper to format validation errors
const errorCreate = (errors) => {
   return errors.map((e) => ({ field: e.path, message: e.msg }));
};

class UserControllers {
   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    New User Registration
 * @route          POST /api/v1/users/register
 * @access         Admin (only admins can register new users)
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   RegisterNewUser = async (req, res) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
         return res.status(400).json({
            msg: "Validation error",
            error: errorCreate(error.array()),
            data: null,
         });
      }

      const { firstName, lastName, username, email, password } = matchedData(req);

      try {
         // Check if user already exists
         const existingUser = await User.findOne({
            $or: [{ email }, { username }],
         });

         if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Username";
            return res.status(409).json({ error: `${field} is already taken.` });
         }

         // Hash the password
         const passwordHash = await User.hashPassword(password);

         // Create a new user in the database
         const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            passwordHash,
         });

         // Respond with the created user (omitting the password)
         const userObj = newUser.toObject();
         delete userObj.passwordHash;

         res.status(201).json({
            message: "User created successfully!",
            user: userObj,
         });
      } catch (error) {
         console.error("Error Registering user:", error);
         res.status(500).json({ message: "Server error during registration" });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    User Login
 * @route          POST /api/v1/users/login
 * @access         Public
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   loginUser = async (req, res) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
         return res.status(400).json({
            msg: "Validation error",
            error: errorCreate(error.array()),
            data: null,
         });
      }

      const { emailOrUsername, password } = matchedData(req);

      try {
         // Find user by email OR username
         const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
         });

         if (!user) {
            return res
               .status(401)
               .json({ error: "User Name or Email Not Registered in System" });
         }

         //  Compare passwords
         const isMatch = await user.comparePassword(password);

         if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
         }

         //  Generate token and respond
         generateTokenWithCookies(res, user._id);

         const userObj = user.toObject();
         delete userObj.passwordHash;

         res.status(200).json({
            message: "Login Successful",
            user: userObj,
         });
      } catch (error) {
         console.error(error);
         res.status(500).json({ message: "Server error during login" });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Logout user / clear cookie
 * @route          POST /api/v1/users/logout
 * @access         Public
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   logoutUser = (req, res) => {
      res.cookie("jwt", "", {
         httpOnly: true,
         expires: new Date(0),
      });
      res.status(200).json({ message: "Logged out successfully" });
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Request a password reset link
 * @route          POST /api/v1/users/forgot-password
 * @access         Public
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   forgotPassword = async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({
            message: "Validation error",
            error: errorCreate(errors.array()),
            data: null,
         });
      }

      const { email } = matchedData(req);

      try {
         const user = await User.findOne({ email });

         if (!user) {
            return res.status(200).json({
               message: "If an account with that email exists, a password reset link has been sent.",
            });
         }

         // Generate a secure, unique token
         const resetToken = generateSecureToken();
         const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now

         // Save the token and its expiration to the user record
         user.passwordResetToken = resetToken;
         user.passwordResetExpires = resetTokenExpiration;
         await user.save();

         // Construct the reset URL for the frontend
         const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

         // Send the email
         await sendEmail(
            user.email,
            "Password Reset Request",
            `Click the following link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.`
         );

         res.status(200).json({
            message: "Password reset link has been sent to your email.",
         });
      } catch (error) {
         console.error("Forgot password error:", error);
         res.status(500).json({
            message: "Server error during password reset request.",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Reset user password using a valid token
 * @route          POST /api/v1/users/reset-password/:token
 * @access         Public
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   resetPassword = async (req, res) => {
      const { token } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({
            msg: "Validation error",
            error: errorCreate(errors.array()),
            data: null,
         });
      }

      const { newPassword } = matchedData(req);

      try {
         const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gte: new Date() },
         });

         if (!user) {
            return res.status(400).json({
               message: "Password reset token is invalid or has expired.",
            });
         }

         // Hash the new password
         user.passwordHash = await User.hashPassword(newPassword);
         user.passwordResetToken = null;
         user.passwordResetExpires = null;
         await user.save();

         res.status(200).json({
            message: "Your password has been successfully reset. Please login with new credentials.",
         });
      } catch (error) {
         console.error("Reset password error:", error);
         res.status(500).json({
            message: "Server error during password reset.",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Get All Users
 * @route          GET /api/v1/users/
 * @access         Admin
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   showAllUsers = async (req, res) => {
      try {
         const users = await User.find()
            .select("-passwordHash -passwordResetToken -passwordResetExpires")
            .sort({ createdAt: -1 });

         return res.status(200).json({
            msg: "All Users",
            data: users,
         });
      } catch (error) {
         console.error("Error:", error);
         return res.status(500).json({
            msg: "error",
            error: "Internal Server Error",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Delete User by ID
 * @route          DELETE /api/v1/users/:id
 * @access         Admin
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   deleteUserById = async (req, res) => {
      const { id } = req.params;

      if (!id) {
         return res.status(400).json({ message: "User ID is required." });
      }

      try {
         const user = await User.findByIdAndDelete(id);

         if (!user) {
            return res
               .status(404)
               .json({ message: `User with ID ${id} not found.` });
         }

         return res.status(200).json({ message: "User deleted successfully." });
      } catch (error) {
         console.error("Error deleting user:", error);
         return res.status(500).json({
            msg: "error",
            error: "Internal Server Error",
         });
      }
   };

   /**------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @description    Get User Profile by them self
 * @route          GET /api/v1/users/my-profile
 * @access         Authenticated User
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
   myProfile = async (req, res) => {
      const userId = req.authUser._id;

      try {
         const user = await User.findById(userId).select(
            "-passwordHash -passwordResetToken -passwordResetExpires"
         );

         if (!user) {
            return res.status(404).json({ message: "User not found." });
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
