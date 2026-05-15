import multer from "multer";
import path from "path";
import fs from "fs";

// --- Shared file filter (images only) ---
const fileFilter = (req, file, cb) => {
   console.log("📂 Incoming file to Multer:", file.originalname, file.mimetype, file.fieldname);
   const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
   if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      console.error("❌ File rejected by filter:", file.mimetype);
      cb(new Error("Only images (JPG, PNG, WEBP) are allowed"), false);
   }
};

// ── Profile Picture Upload ──────────────────────────────────────────────────────
const profileUploadDir = "uploads/profile_pics";
if (!fs.existsSync(profileUploadDir)) {
   fs.mkdirSync(profileUploadDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, profileUploadDir);
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
   },
});

export const upload = multer({
   storage: profileStorage,
   fileFilter,
   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// ── Invitation Images Upload ────────────────────────────────────────────────────
const invitationUploadDir = "uploads/invitations";
if (!fs.existsSync(invitationUploadDir)) {
   fs.mkdirSync(invitationUploadDir, { recursive: true });
}

const invitationStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, invitationUploadDir);
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "inv-" + uniqueSuffix + path.extname(file.originalname));
   },
});

export const invitationUpload = multer({
   storage: invitationStorage,
   fileFilter,
   limits: { fileSize: 10 * 1024 * 1024 }, // 5MB per file for high-res invitation images
});
