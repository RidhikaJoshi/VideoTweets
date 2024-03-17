import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
      // throw new Error("File path is required");
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file is uploaded to cloudinary
    console.log("File uploaded to cloudinary");
    console.log(response);
    console.log(response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    // it removes the locally saved temporary file as the upload option got failed
    return null;
  }
};
export { uploadOnCloudinary };
