import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Internal Server Error while generating refresh and access token"
    );
  }
};

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

const loginUser = asyncHandler(async (req, res) => {
  // take username or email and password from frontend
  // validation - check if all the fields are filled or not
  // check if user exists in the database
  // if user exists then check if password is correct or not
  // if password is correct then geberate access token and refresh token
  // send secure cookies (access and refresh token) to frontend
  // send response to frontend

  const { username, email, password } = req.body;
  // console.log("req.body", req.body);
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist in the database");
  }
  if (await user.isPasswordCorrect(password)) {
    // if password is correct then geberate access token and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true, //The httpOnly property is set to true, which means that the cookie can only be accessed by the server.
      secure: true, // The secure property is also set to true, which means that the cookie will only be sent over secure (HTTPS) connections.
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200, // status code
          {
            // data
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User Logged In Successfully" // message
        )
      );
  } else {
    throw new ApiError(400, "Entered password is incorrect");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  // clear cookies
  // clear refreshToken field
  // send response to frontend
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  //console.log("incomingRefreshToken", incomingRefreshToken);
  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh Token is required");
  }
  try {
    // firstly verify whether the incoming refresh token is correct or not
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }
    const { accessToken, newrefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true, // only server can change the cookies
      secure: true, // https request only
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            newrefreshToken,
          },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(401, "Invalid Refresh Token");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
