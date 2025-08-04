import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../../config/cloudinary.config.js';
import path from 'path';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
  const isPDF = file.mimetype === 'application/pdf';
  const baseName = path.parse(file.originalname).name;

  return {
    folder: 'lms_uploads',
    resource_type: isPDF ? 'raw' : 'auto',
    public_id: isPDF
      ? `${Date.now()}-${baseName}.pdf`
      : `${Date.now()}-${baseName}`,
  };
}

});

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'video/mp4',
];

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  }
  cb(null, true);
};

const uploader = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB
  },
});

// ✅ Individual exports for different fields
export const uploadSingle = uploader.single('avatar');
export const uploadThumbnail = uploader.single('thumbnail');
export const uploadLectureMidd = uploader.single('lectureVedio');
export const uploadResourcesMidd = uploader.single("resources");

export default uploader;
