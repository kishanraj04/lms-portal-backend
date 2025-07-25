import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from "../../config/cloudinary.config.js"
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'lms_uploads', // general folder name
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'mp4'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      resource_type: 'auto', 
      transformation: [{ width: 500, height: 500, crop: 'limit' }], 
    };
  },
});

const uploader = multer({ storage });

export const uploadSingle = uploader.single('avatar');
export const uploadThumbnail = uploader.single("thumbnail");
export const uploadLectureMidd = uploader.single('lectureVedio'); 

// Or export generic uploader for custom use
export default uploader;
