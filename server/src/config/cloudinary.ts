import dotenv from "dotenv";
dotenv.config(); 

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "users",         
    public_id: file.originalname.split('.')[0],
    resource_type: "image",
    type: "authenticated",       
  }),
});

export function getSignedImageURL(
  publicId: string, 
  format: string = "jpg",
  expiresInSeconds = 300
) {
  return cloudinary.utils.private_download_url(publicId, format, {
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });
}


export { cloudinary };
