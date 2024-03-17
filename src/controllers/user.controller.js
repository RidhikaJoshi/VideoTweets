import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - check all fields are filled and correctly filled
  // check if user already exists in the database -using email and username
  // check for images,check for avatar
  // upload images to cloudinary, check for avatar
  // create user object-because mongodb is NoSQL database and create entry in database
  // remove password and refresh token from the response
  // check for user creation
  // send response to frontend

  // get user details from frontend
  // res.body is given by express for data fields
  const { username, fullName, email, password } = req.body;
  //console.log("req.body", req.body);
  // validation - check all fields are filled and correctly filled
  if (fullName === "" || email === "" || password === "" || username === "") {
    throw new ApiError(400, "All fields are required");
  }
  if (email.includes("@") === false) {
    throw new ApiError(400, "Invalid email");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  //check if user already exists in the database -using email and username
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  }); // $or is used to check for multiple conditions
  if (existedUser) {
    throw new ApiError(400, "User with username or email already exists");
  }

  //check for images,check for avatar
  // res.files is provided by the middleware multer for files uploading
  if (req.files) {
    //console.log("req.files", req.files);
    const avatarLocalPath = req.files.avatar ? req.files.avatar[0].path : null;
    // this gives the localfilepath provided by the multer
    const coverImageLocalPath = req.files.coverImage
      ? req.files.coverImage[0].path
      : null;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar File is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
      throw new ApiError(500, "Internal Server Error");
    }

    // create user object-because mongodb is NoSQL database and create entry in database
    const user = await User.create({
      fullName,
      email,
      username: username.toLowerCase(),
      avatar: avatar.url,
      coverImage: coverImage ? coverImage.url : "",
      password,
    });

    // remove password and refresh token from the response
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    // check for user creation
    if (!createdUser) {
      throw new ApiError(500, "Internal Server Error");
    }

    // send response to frontend
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User Registered Successfully"));
  }
});

export { registerUser };
