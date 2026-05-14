import { body } from "express-validator";

// --- User Validation Rules ------------------------------------------------------------------------------------------

export const RegisterValidator = () => [
   body("firstName")
      .trim()
      .notEmpty().withMessage("First name is required")
      .isLength({ min: 2, max: 50 }).withMessage("First name must be between 2 and 50 characters"),
   body("lastName")
      .trim()
      .notEmpty().withMessage("Last name is required")
      .isLength({ min: 2, max: 50 }).withMessage("Last name must be between 2 and 50 characters"),
   body("username")
      .trim()
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters")
      .isAlphanumeric().withMessage("Username must contain only letters and numbers"),
   body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Please enter a valid email"),
   body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const loginValidator = () => [
   body("emailOrUsername")
      .trim()
      .notEmpty().withMessage("Email or Username is required"),
   body("password")
      .notEmpty().withMessage("Password is required"),
];

export const forgotEmailValidator = () => [
   body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Please enter a valid email"),
];

export const resetPasswordValidate = () => [
   body("newPassword")
      .notEmpty().withMessage("New password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

// --- Invitation Validation Rules -------------------------------------------------------------------------------------

export const createInvitationValidator = () => [
   body("cardId")
      .trim()
      .notEmpty().withMessage("Card ID (slug) is required")
      .isLength({ min: 3, max: 60 }).withMessage("Card ID must be between 3 and 60 characters")
      .matches(/^[a-z0-9-]+$/).withMessage("Card ID can only contain lowercase letters, numbers, and hyphens"),
   body("templateId")
      .trim()
      .notEmpty().withMessage("Template selection is required")
      .isIn(["ethereal", "lumina", "kinetic"]).withMessage("Template must be 'ethereal', 'lumina', or 'kinetic'"),
   body("brideName")
      .trim()
      .notEmpty().withMessage("Bride name is required")
      .isLength({ min: 2, max: 100 }).withMessage("Bride name must be between 2 and 100 characters"),
   body("groomName")
      .trim()
      .notEmpty().withMessage("Groom name is required")
      .isLength({ min: 2, max: 100 }).withMessage("Groom name must be between 2 and 100 characters"),
   body("eventDate")
      .notEmpty().withMessage("Event date is required")
      .isISO8601().withMessage("Event date must be a valid date"),
   body("eventLocation")
      .trim()
      .notEmpty().withMessage("Event location is required")
      .isLength({ min: 3, max: 200 }).withMessage("Event location must be between 3 and 200 characters"),
   body("welcomeText")
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage("Welcome text must not exceed 500 characters"),
];
