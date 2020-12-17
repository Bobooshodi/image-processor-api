import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDUNARY_CLOUD_NAME,
  api_key: process.env.CLOUDUNARY_API_KEY,
  api_secret: process.env.CLOUDUNARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ImageProcessingAPI",
    allowed_formats: ["jpg", "png", "jpeg"],
  }
});

export const uploadMiddleWare = multer({ storage: storage });