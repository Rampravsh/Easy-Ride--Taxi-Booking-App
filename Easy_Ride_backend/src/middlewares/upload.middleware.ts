import multer from 'multer';
import { ApiError } from '../shared/errors/ApiError';

/**
 * Configure storage.
 * Memory storage is used to keep the file in a buffer, which is ideal
 * for processing images before saving or for uploading to Cloudinary.
 */
const storage = multer.memoryStorage();

/**
 * File filter to ensure only image files are uploaded.
 */
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError('Not an image! Please upload only images.', 400), false);
  }
};

/**
 * Base multer configuration.
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
});

/**
 * Helper middleware for uploading a single image.
 * @param fieldName - The name of the form field containing the file.
 */
export const uploadSingleImage = (fieldName: string) => upload.single(fieldName);

/**
 * Helper middleware for uploading multiple images.
 * @param fieldName - The name of the form field containing the files.
 * @param maxCount - Maximum number of files allowed.
 */
export const uploadMultipleImages = (fieldName: string, maxCount: number) =>
  upload.array(fieldName, maxCount);
