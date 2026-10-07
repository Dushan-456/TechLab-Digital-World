import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRootDir = path.resolve(__dirname, "../../");

/**
 * Safely delete an uploaded file from disk if it exists inside the uploads directory.
 * @param {string} filePath - Relative or root-relative URL (e.g. "/uploads/invitations/inv-123.jpg")
 */
export const deleteUploadedFile = (filePath) => {
   if (!filePath || typeof filePath !== "string") return;

   // Do not attempt to delete remote URLs
   if (filePath.startsWith("http://") || filePath.startsWith("https://")) return;

   try {
      const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
      const fullPath = path.resolve(backendRootDir, cleanPath);
      const uploadsDir = path.resolve(backendRootDir, "uploads");

      // Guard: must reside inside uploads directory
      if (fullPath.startsWith(uploadsDir) && fs.existsSync(fullPath)) {
         fs.unlinkSync(fullPath);
         console.log(`🗑️ Deleted orphaned file: ${cleanPath}`);
      }
   } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
   }
};

/**
 * Safely delete an array of uploaded files from disk.
 * @param {string[]} filePaths
 */
export const deleteUploadedFiles = (filePaths) => {
   if (!Array.isArray(filePaths)) return;
   filePaths.forEach(deleteUploadedFile);
};
