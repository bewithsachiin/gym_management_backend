import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.js";

/**
 * Factory function to create multer middleware for Cloudinary
 * @param {string} folderName - Cloudinary folder name
 * @returns multer middleware
 */
export const uploadImage = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName, // dynamic folder
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  });

  return multer({ storage });
};

