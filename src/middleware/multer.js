import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../../config/cloudinary.config.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: 'lms_uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'mp4'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      resource_type: 'auto', // or isVideo ? 'video' : 'image'
      // ⛔️ If you see issues with videos, remove transformation or only apply to images
      transformation: !isVideo ? [{ width: 500, height: 500, crop: 'limit' }] : undefined,
    };
  },
});

// Only accept these mimetypes
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
    fileSize: 200 * 1024 * 1024, // 200MB, change as you wish
  },
});

export const uploadSingle = uploader.single('avatar');
export const uploadThumbnail = uploader.single('thumbnail');
export const uploadLectureMidd = uploader.single('lectureVedio');

export default uploader;
