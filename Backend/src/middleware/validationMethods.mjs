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
   body("invitationType")
      .trim()
      .notEmpty().withMessage("Invitation type is required")
      .isIn(["wedding", "birthday", "event"]).withMessage("Type must be 'wedding', 'birthday', or 'event'"),
   body("cardId")
      .trim()
      .notEmpty().withMessage("Card ID (slug) is required")
      .isLength({ min: 3, max: 60 }).withMessage("Card ID must be between 3 and 60 characters")
      .matches(/^[a-z0-9-]+$/).withMessage("Card ID can only contain lowercase letters, numbers, and hyphens"),
   body("templateId")
      .trim()
      .notEmpty().withMessage("Template selection is required"),
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

   // Wedding Specific
   body("brideName")
      .if(body("invitationType").equals("wedding"))
      .trim().notEmpty().withMessage("Bride name is required"),
   body("groomName")
      .if(body("invitationType").equals("wedding"))
      .trim().notEmpty().withMessage("Groom name is required"),
   body("brideParents")
      .if(body("invitationType").equals("wedding"))
      .optional().trim(),
   body("groomParents")
      .if(body("invitationType").equals("wedding"))
      .optional().trim(),
   body("eventTime").optional().trim(),
   body("mapEmbedUrl").optional().trim(),
   body("ceremonyType")
      .if(body("invitationType").equals("wedding"))
      .optional()
      .isInt().withMessage("Ceremony type must be a valid number"),
   body("dressCode")
      .if(body("invitationType").equals("wedding"))
      .optional()
      .isInt().withMessage("Dress code must be a valid number"),
   body("receptionType")
      .if(body("invitationType").equals("wedding"))
      .optional()
      .isInt().withMessage("Reception type must be a valid number"),
   body("backgroundMusic")
      .if(body("invitationType").equals("wedding"))
      .optional().trim(),

   // Birthday Specific
   body("celebrantName")
      .if(body("invitationType").equals("birthday"))
      .trim().notEmpty().withMessage("Celebrant name is required"),
   body("age")
      .if(body("invitationType").equals("birthday"))
      .optional({ checkFalsy: true })
      .isNumeric().withMessage("Age must be a number"),

   // Event Specific
   body("eventName")
      .if(body("invitationType").equals("event"))
      .trim().notEmpty().withMessage("Event name is required"),
   body("organizer").optional().trim(),
   body("description").optional().trim(),
];

// --- Business Card Validation Rules -----------------------------------------------------------------------------------

export const createBusinessCardValidator = () => [
   body("cardId")
      .trim()
      .notEmpty().withMessage("Card ID (slug) is required")
      .isLength({ min: 3, max: 60 }).withMessage("Card ID must be between 3 and 60 characters")
      .matches(/^[a-z0-9-]+$/).withMessage("Card ID can only contain lowercase letters, numbers, and hyphens"),
   body("templateId")
      .trim()
      .notEmpty().withMessage("Template selection is required"),
   body("personalInfo.fullName")
      .trim()
      .notEmpty().withMessage("Full name is required"),
];
