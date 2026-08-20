import multer from "multer";
import { v2 as cloudinary } from "cloudinary";



export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "mern-chat/messages",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    stream.end(fileBuffer);
  });